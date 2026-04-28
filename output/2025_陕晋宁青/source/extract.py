"""Extract text + image-anchor map from a Chinese physics gaokao docx with explanations.
Output:
  full_text.md      — markdown with image anchors like ![](media/image12.png)
  paragraph_index.json — per-paragraph: index, text, images embedded
"""
import json, os, re, shutil
from docx import Document
from docx.oxml.ns import qn
from pathlib import Path

SRC = r"C:/Users/60507/精品解析：2025年高考陕西、山西、青海、宁夏卷物理真题（解析版）.docx"
OUT = Path(r"C:/Users/60507/physics_anim/source_2025_shaanxi")
IMG_OUT = OUT / "images"
IMG_OUT.mkdir(parents=True, exist_ok=True)

# Copy media from unpacked dir
src_media = OUT / "unpacked" / "word" / "media"
if src_media.exists():
    for f in src_media.iterdir():
        shutil.copy(f, IMG_OUT / f.name)

doc = Document(SRC)

# Build relationship map: rId -> image filename
rels = doc.part.rels
rid_to_image = {}
for rid, rel in rels.items():
    if "image" in rel.reltype:
        # rel.target_ref like 'media/image1.png'
        rid_to_image[rid] = os.path.basename(rel.target_ref)

# Walk paragraphs, capturing text and image anchors in order
md_lines = []
para_index = []

def extract_images_from_paragraph(p_xml):
    """Find all r:embed values inside a paragraph's XML, in document order."""
    images = []
    for blip in p_xml.iter(qn("a:blip")):
        embed = blip.get(qn("r:embed"))
        if embed and embed in rid_to_image:
            images.append(rid_to_image[embed])
    # Also catch v:imagedata (older WMF format)
    for vimg in p_xml.iter("{urn:schemas-microsoft-com:vml}imagedata"):
        rid = vimg.get(qn("r:id"))
        if rid and rid in rid_to_image:
            images.append(rid_to_image[rid])
    return images

for i, para in enumerate(doc.paragraphs):
    text = para.text.strip()
    images = extract_images_from_paragraph(para._element)
    para_index.append({"i": i, "text": text, "images": images})
    if text:
        md_lines.append(text)
    for img in images:
        md_lines.append(f"![]({img})")
    if text or images:
        md_lines.append("")  # blank line for readability

(OUT / "full_text.md").write_text("\n".join(md_lines), encoding="utf-8")
(OUT / "paragraph_index.json").write_text(
    json.dumps(para_index, ensure_ascii=False, indent=2), encoding="utf-8"
)

print(f"paragraphs: {len(para_index)}")
print(f"with text: {sum(1 for p in para_index if p['text'])}")
print(f"with images: {sum(1 for p in para_index if p['images'])}")
print(f"total image refs: {sum(len(p['images']) for p in para_index)}")
print(f"unique images: {len(set(img for p in para_index for img in p['images']))}")
