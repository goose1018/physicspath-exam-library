"""Extract DOCX content for 2024 山东卷."""
import json, os
from docx import Document
from docx.oxml.ns import qn
from pathlib import Path

SRC = r"C:/Users/60507/Desktop/17-24物理/2024·高考物理真题/2024年高考物理试卷（山东）（解析卷）.docx"
OUT = Path(__file__).parent
doc = Document(SRC)
rels = doc.part.rels
rid_to_image = {rid: os.path.basename(rel.target_ref) for rid, rel in rels.items() if "image" in rel.reltype}

images_dir = OUT / "images"
images_dir.mkdir(exist_ok=True)
for rid, rel in rels.items():
    if "image" in rel.reltype:
        (images_dir / os.path.basename(rel.target_ref)).write_bytes(rel.target_part.blob)

def extract_images(p_xml):
    images = []
    for blip in p_xml.iter(qn("a:blip")):
        embed = blip.get(qn("r:embed"))
        if embed and embed in rid_to_image: images.append(rid_to_image[embed])
    for vimg in p_xml.iter("{urn:schemas-microsoft-com:vml}imagedata"):
        rid = vimg.get(qn("r:id"))
        if rid and rid in rid_to_image: images.append(rid_to_image[rid])
    return images

md_lines = []
for para in doc.paragraphs:
    text = para.text.strip()
    images = extract_images(para._element)
    if text: md_lines.append(text)
    for img in images: md_lines.append(f"![]({img})")
    if text or images: md_lines.append("")

(OUT / "full_text.md").write_text("\n".join(md_lines), encoding="utf-8")
print(f"done: {len(md_lines)} lines, {len(rid_to_image)} images")
