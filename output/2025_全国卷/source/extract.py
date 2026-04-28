"""Extract text + image-anchor map from 2025 全国卷 解析版 DOCX."""
import json, os, shutil
from docx import Document
from docx.oxml.ns import qn
from pathlib import Path

SRC = r"C:/Users/60507/【2025新版】高考物理真题（持续更新）/精品解析：2025年高考全国卷理综物理高考真题解析（参考版）/精品解析：2025高考课标卷物理真题（解析版）.docx"
OUT = Path(__file__).parent

doc = Document(SRC)
rels = doc.part.rels
rid_to_image = {}
for rid, rel in rels.items():
    if "image" in rel.reltype:
        rid_to_image[rid] = os.path.basename(rel.target_ref)

def extract_images(p_xml):
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

md_lines = []
para_index = []
for i, para in enumerate(doc.paragraphs):
    text = para.text.strip()
    images = extract_images(para._element)
    para_index.append({"i": i, "text": text, "images": images})
    if text: md_lines.append(text)
    for img in images: md_lines.append(f"![]({img})")
    if text or images: md_lines.append("")

(OUT / "full_text.md").write_text("\n".join(md_lines), encoding="utf-8")
(OUT / "paragraph_index.json").write_text(
    json.dumps(para_index, ensure_ascii=False, indent=2), encoding="utf-8")

print(f"paragraphs: {len(para_index)}")
print(f"with text: {sum(1 for p in para_index if p['text'])}")
print(f"with images: {sum(1 for p in para_index if p['images'])}")
print(f"unique images: {len(set(img for p in para_index for img in p['images']))}")
