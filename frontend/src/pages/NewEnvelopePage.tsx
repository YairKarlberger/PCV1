import React, { useState } from "react"
import axios from "axios"

export default function NewEnvelopePage(){
  const [draftId, setDraftId] = useState<string>("")
  const [first, setFirst] = useState("Alex")
  const [last, setLast] = useState("Smith")
  const [dept, setDept] = useState("Art")
  const [prod, setProd] = useState("TLOU")
  const [files, setFiles] = useState<File[]>([])
  const [uploaded, setUploaded] = useState<{id:string,file:string}[]>([])

  async function createDraft(){
    const res = await axios.post("/api/drafts", {
      custodian_first: first, custodian_last: last,
      dept, production: prod
    })
    setDraftId(res.data.draftId)
    setUploaded([])
  }

  async function fetchUploads(){
    if(!draftId) return
    const res = await axios.get(`/api/receipts/list/${draftId}`)
    setUploaded(res.data.map((x:any)=>({id:x.id, file:x.file})))
  }

  async function upload(){
    if(!draftId || files.length===0) return
    const form = new FormData()
    form.append("draftId", draftId)
    files.forEach(f => form.append("files", f))
    await axios.post("/api/receipts/upload", form, { headers: {"Content-Type":"multipart/form-data"} })
    setFiles([])
    await fetchUploads()
  }

  async function submitDraft(){
    if(!draftId) return
    // Add two example lines then submit
    await axios.put(`/api/drafts/${draftId}/lines`, {
      items: [
        { position:1, date:"2025-11-02", vendor:"Home Depot", description:"Lumber", net:50, hst:6.5, gst:0, pst:0, tip:0, total:56.5, voucher_no:"V001" },
        { position:2, date:"2025-11-03", vendor:"Tim Hortons", description:"Crew coffee", net:20, hst:2.6, gst:0, pst:0, tip:0, total:22.6, voucher_no:"V002" }
      ]
    })
    const res = await axios.post(`/api/drafts/${draftId}/submit`)
    alert("Submitted: " + res.data.envNo + "\n" + res.data.envelopePdfPath + "\n" + res.data.receiptsPdfPath)
  }

  return (
    <div>
      <p>Create a draft, upload receipts (jpg/png/pdf), then submit.</p>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <input value={first} onChange={e=>setFirst(e.target.value)} placeholder="First name"/>
        <input value={last} onChange={e=>setLast(e.target.value)} placeholder="Last name"/>
        <input value={dept} onChange={e=>setDept(e.target.value)} placeholder="Dept"/>
        <input value={prod} onChange={e=>setProd(e.target.value)} placeholder="Production"/>
        <button onClick={createDraft}>Create Draft</button>
      </div>

      <div style={{margin:"12px 0", padding:12, border:"1px solid #ccc"}}>
        <strong>Receipts Upload</strong><br/>
        <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
        <button onClick={upload} disabled={!draftId || files.length===0} style={{marginLeft:8}}>Upload</button>
        <button onClick={fetchUploads} disabled={!draftId} style={{marginLeft:8}}>Refresh List</button>
        <div style={{marginTop:8}}>
          <div><em>Selected (not yet uploaded):</em> {files.map(f=>f.name).join(", ") || "(none)"}</div>
          <div style={{marginTop:4}}><em>Uploaded:</em> {uploaded.length ? uploaded.map(u=>u.file).join(", ") : "(none)"}</div>
        </div>
      </div>

      <div>
        <button onClick={submitDraft} disabled={!draftId}>Submit Envelope</button>
      </div>

      <div style={{marginTop:8}}>Draft ID: {draftId || "(none)"}</div>
    </div>
  )
}
