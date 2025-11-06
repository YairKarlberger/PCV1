from decimal import Decimal
import os

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

from app.db.session import SessionLocal
from app.models import Envelope, LineItem


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


def render_receipts_pdf(envelope_id: str) -> bytes:
    blank_html = "<html><body><p>Receipts pack (MVP placeholder). Attach originals here in V2.</p></body></html>"
    return HTML(string=blank_html).write_pdf()
