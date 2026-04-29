"""Extract raw_text.txt + images from 2021 全国甲卷 DOCX."""
import os
from pathlib import Path
from docx import Document
from docx.oxml.ns import qn

SRC = r"C:/Users/60507/Desktop/17-24物理/2021·高考物理真题/2021_全国甲卷.docx"
OUT = Path(r"C:/Users/60507/physics_anim/output/2021_全国甲卷/source")
IMG_OUT = OUT / "images"
IMG_OUT.mkdir(parents=True, exist_ok=True)

doc = Document(SRC)
rels = doc.part.rels
rid_to_image = {rid: os.path.basename(rel.target_ref) for rid, rel in rels.items() if "image" in rel.reltype}

seen = set()
for rid, rel in rels.items():
    if "image" not in rel.reltype: continue
    fname = os.path.basename(rel.target_ref)
    if fname in seen: continue
    seen.add(fname)
    with open(IMG_OUT / fname, "wb") as f:
        f.write(rel.target_part.blob)

def extract_images_from_paragraph(p_xml):
    images = []
    for blip in p_xml.iter(qn("a:blip")):
        embed = blip.get(qn("r:embed"))
        if embed and embed in rid_to_image:
            images.append(rid_to_image[embed])
    for vimg in p_xml.iter("{urn:schemas-microsoft-com:vml}imagedata"):
        rid = vimg.get(qn("r:id"))
        if rid and rid in rid_to_image:
            images.append(rid_to_image[rid])
    return images

lines = []
for i, para in enumerate(doc.paragraphs):
    text = para.text.strip()
    images = extract_images_from_paragraph(para._element)
    if not text and not images: continue
    parts = []
    if text: parts.append(text)
    for img in images: parts.append(f"![{img}]")
    lines.append(f"[P{i}] " + " ".join(parts))

with open(OUT / "raw_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"OK | paragraphs: {len(lines)} | images: {len(seen)}")
