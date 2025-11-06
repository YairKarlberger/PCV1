from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field, condecimal


class EnvelopeHeaderIn(BaseModel):
    production: Optional[str] = None
    dept: Optional[str] = None
    custodian_first: str
    custodian_last: str
    currency: str = "CAD"
    float_amount: condecimal(max_digits=12, decimal_places=2) = Field(default=0)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    co: Optional[str] = None
    loc: Optional[str] = None
    epi: Optional[str] = None
    detl: Optional[str] = None
    set: Optional[str] = None
    ff1: Optional[str] = None
    ff4: Optional[str] = None


class LineIn(BaseModel):
    id: Optional[str] = None
    position: Optional[int] = None
    date: Optional[date] = None
    vendor: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    gl_account: Optional[str] = None
    dept_code: Optional[str] = None
    cost_code: Optional[str] = None
    net: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    pst: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    gst: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    hst: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    tip: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    total: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    voucher_no: Optional[str] = None
    receipt_id: Optional[str] = None


class LinesIn(BaseModel):
    items: List[LineIn]
