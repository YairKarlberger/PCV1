from decimal import Decimal
from io import BytesIO
import os

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader

from app.db.session import SessionLocal
from app.models import Envelope, LineItem, Receipt


def _tpl_env() -> Environment:
    templates_path = os.path.join(os.path.dirname(__file__), "templates")
    return Environment(
        loader=FileSystemLoader(templates_path),
        autoescape=select_autoescape(["html"]),
    )


def _d(value) -> Decimal:
    if value is None:
        return Decimal("0.00")
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value))
    except Exception:
        return Decimal("0.00")


def _sum(items, attr: str) -> Decimal:
    total = Decimal("0.00")
    for item in items:
        total += _d(getattr(item, attr))
    return total


def _currency(value: Decimal) -> str:
    return f"{value:.2f}"


def render_envelope_pdf(envelope_id: str) -> bytes:
    db = SessionLocal()
    try:
        env = db.get(Envelope, envelope_id)
        if not env:
            raise RuntimeError("Envelope not found")
        lines = (
            db.query(LineItem)
            .filter(LineItem.envelope_id == env.id)
            .order_by(LineItem.position)
            .all()
        )

        net = _sum(lines, "net")
        pst = _sum(lines, "pst")
        gst = _sum(lines, "gst")
        hst = _sum(lines, "hst")
        tip = _sum(lines, "tip")
        grand = net + pst + gst + hst + tip

        float_amt = _d(env.float_amount)
        diff = float_amt - grand
        owed_to_prod = diff if diff > Decimal("0.00") else Decimal("0.00")
        owed_to_cust = -diff if diff < Decimal("0.00") else Decimal("0.00")

        totals = {
            "net": _currency(net),
            "pst": _currency(pst),
            "gst": _currency(gst),
            "hst": _currency(hst),
            "tip": _currency(tip),
            "grand": _currency(grand),
            "owed_to_prod": _currency(owed_to_prod),
            "owed_to_cust": _currency(owed_to_cust),
        }

        jenv = _tpl_env()
        tpl = jenv.get_template("envelope.html")
        html = tpl.render(env=env, lines=lines, totals=totals)
        pdf = HTML(string=html).write_pdf()
        return pdf
    finally:
        db.close()


def _image_to_pdf_bytes(image_path: str, page_size=A4) -> bytes:
    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=page_size)
    try:
        img = ImageReader(image_path)
        iw, ih = img.getSize()
        pw, ph = page_size
        margin = 36
        maxw, maxh = pw - 2 * margin, ph - 2 * margin
        scale = min(maxw / iw, maxh / ih)
        w, h = iw * scale, ih * scale
        x = (pw - w) / 2
        y = (ph - h) / 2
        c.drawImage(img, x, y, width=w, height=h, preserveAspectRatio=True, mask="auto")
    except Exception:
        c.drawString(72, ph / 2, f"Could not render image: {os.path.basename(image_path)}")
    c.showPage()
    c.save()
    packet.seek(0)
    return packet.read()


def render_receipts_pdf(envelope_id: str) -> bytes:
    db = SessionLocal()
    try:
        env = db.get(Envelope, envelope_id)
        if not env:
            raise RuntimeError("Envelope not found")
        receipts = db.query(Receipt).filter(Receipt.envelope_id == env.id).all()

        writer = PdfWriter()

        for receipt in receipts:
            if not receipt.file_path or not os.path.exists(receipt.file_path):
                placeholder = HTML(
                    string=f"<html><body><p>Missing receipt file: {receipt.original_filename}</p></body></html>"
                ).write_pdf()
                placeholder_reader = PdfReader(BytesIO(placeholder))
                for page in placeholder_reader.pages:
                    writer.add_page(page)
                continue

            ext = os.path.splitext(receipt.file_path)[1].lower()
            try:
                if ext == ".pdf":
                    reader = PdfReader(receipt.file_path)
                    for page in reader.pages:
                        writer.add_page(page)
                else:
                    img_pdf = _image_to_pdf_bytes(receipt.file_path)
                    img_reader = PdfReader(BytesIO(img_pdf))
                    for page in img_reader.pages:
                        writer.add_page(page)
            except Exception:
                err_pdf = HTML(
                    string=f"<html><body><p>Unable to render: {receipt.original_filename}</p></body></html>"
                ).write_pdf()
                err_reader = PdfReader(BytesIO(err_pdf))
                for page in err_reader.pages:
                    writer.add_page(page)

        if len(writer.pages) == 0:
            info_pdf = HTML(string="<html><body><p>No receipts uploaded.</p></body></html>").write_pdf()
            info_reader = PdfReader(BytesIO(info_pdf))
            for page in info_reader.pages:
                writer.add_page(page)

        out_bytes = BytesIO()
        writer.write(out_bytes)
        return out_bytes.getvalue()
    finally:
        db.close()
