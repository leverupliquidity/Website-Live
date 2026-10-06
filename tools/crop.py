import sys
from PIL import Image
src,out,step=sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 1100
im=Image.open(src); w,h=im.size
i=0
for y in range(0,h,step):
    c=im.crop((0,y,w,min(h,y+step))); c.save(f"{out}_{i:02d}.jpg",quality=80); i+=1
print(w,h,i)
