import json, os
from docx import Document
from docx.oxml.ns import qn
from pathlib import Path

SRC = r"C:/Users/60507/Desktop/17-24物理/2024·高考物理真题/2024年高考物理试卷（全国甲卷）（解析卷）.docx"
OUT = Path(__file__).parent
doc = Document(SRC)
rels = doc.part.rels
rid_to_image = {rid: os.path.basename(rel.target_ref) for rid, rel in rels.items() if "image" in rel.reltype}

def extract_images(p_xml):
    images = []
    for blip in p_xml.iter(qn("a:blip")):
        embed = blip.get(qn("r:embed"))
        if embed and embed in rid_to_image: images.append(rid_to_image[embed])
    for vimg in p_xml.iter("{urn:schemas-microsoft-com:vml}imagedata"):
        rid = vimg.get(qn("r:id"))
        if rid and rid in rid_to_image: images.append(rid_to_image[rid])
    return images

md_lines, para_index = [], []
for i, para in enumerate(doc.paragraphs):
    text = para.text.strip()
    images = extract_images(para._element)
    para_index.append({"i": i, "text": text, "images": images})
    if text: md_lines.append(text)
    for img in images: md_lines.append(f"![]({img})")
    if text or images: md_lines.append("")

(OUT / "full_text.md").write_text("\n".join(md_lines), encoding="utf-8")
(OUT / "paragraph_index.json").write_text(json.dumps(para_index, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"paragraphs: {len(para_index)}, with_text: {sum(1 for p in para_index if p['text'])}")
