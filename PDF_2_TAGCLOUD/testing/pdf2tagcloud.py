from PIL import Image
from wordcloud import WordCloud
import numpy as np
mask = np.array(Image.open('zzieut_logo.png'))

text = open('test.txt').read()


wc = WordCloud(font_path='./fonts/NanumGothic.ttf', background_color="white", max_words=20000, mask=mask,max_font_size=300).generate(text)

wc.to_file('test.png')
