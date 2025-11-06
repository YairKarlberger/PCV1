import axios from "axios"
import React, { useState } from "react"

export default function NewEnvelopePage() {
  const [draftId, setDraftId] = useState<string>("")
  const [first, setFirst] = useState("Alex")
  const [last, setLast] = useState("Smith")
  const [dept, setDept] = useState("Art")
  const [prod, setProd] = useState("TLOU")

  async function createDraft() {
    const res = await axios.post("/api/drafts", {
      custodian_first: first,
      custodian_last: last,
      dept,
      production: prod,
    })
    setDraftId(res.data.draftId)
  }

  async function submitDraft() {
    if (!draftId) return
    await axios.put(`/api/drafts/${draftId}/lines`, {
      items: [
        {
          position: 1,
          date: "2025-11-02",
          vendor: "Home Depot",
          description: "Lumber",
          net: 50,
          hst: 6.5,
          gst: 0,
          pst: 0,
          tip: 0,
          total: 56.5,
          voucher_no: "V001",
        },
        {
          position: 2,
          date: "2025-11-03",
          vendor: "Tim Hortons",
          description: "Crew coffee",
          net: 20,
          hst: 2.6,
          gst: 0,
          pst: 0,
          tip: 0,
          total: 22.6,
          voucher_no: "V002",
        },
      ],
    })
    const res = await axios.post(`/api/drafts/${draftId}/submit`)
    alert(`Submitted: ${res.data.envNo}\n${res.data.envelopePdfPath}`)
  }

  return (
    <div>
      <p>Create a draft quickly and submit a sample.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" />
        <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" />
        <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Dept" />
        <input value={prod} onChange={(e) => setProd(e.target.value)} placeholder="Production" />
        <button onClick={createDraft}>Create Draft</button>
        <button onClick={submitDraft} disabled={!draftId}>
          Submit Sample
        </button>
      </div>
      <div>Draft ID: {draftId || "(none)"}</div>
    </div>
  )
}
