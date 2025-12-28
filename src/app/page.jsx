"use client";
import React, { useState, useRef } from 'react';
import { Camera, Download, RefreshCw, Plus, Loader2 } from 'lucide-react';

export default function App() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result.split(',')[1]); };
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setResult(`data:image/png;base64,${data.image}`);
    } catch (err) {
      alert("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-6 font-sans">
      <div className="max-w-xs w-full p-8 rounded-[40px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] bg-[#e0e5ec] text-center">
        <h1 className="text-lg font-bold text-slate-600 mb-6 tracking-tight">Passport AI</h1>
        <div onClick={() => !loading && fileInputRef.current.click()} className="relative h-40 mb-6 rounded-3xl shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center cursor-pointer overflow-hidden">
          <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
          {preview ? <img src={preview} className="w-full h-full object-cover p-2 rounded-3xl" /> : <Plus className="text-slate-300" />}
        </div>
        {!result ? (
          <button onClick={generate} disabled={loading || !image} className="w-full py-4 rounded-2xl shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-blue-600 font-bold text-xs tracking-widest active:shadow-inner disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "CREATE"}
          </button>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-center mb-6 p-2 rounded-2xl shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]">
              <img src={result} className="w-28 h-28 object-cover rounded-xl" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => {const a=document.createElement('a'); a.href=result; a.download='passport.png'; a.click();}} className="flex-1 py-3 rounded-xl shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-emerald-600 font-bold text-[10px]">SAVE</button>
              <button onClick={() => window.location.reload()} className="w-12 h-12 rounded-xl shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] text-slate-400 flex items-center justify-center"><RefreshCw size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
