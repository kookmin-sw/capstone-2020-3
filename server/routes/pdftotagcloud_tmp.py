from os import path
import numpy as np
import matplotlib
import os
import pdftotext
import sys
from PIL import Image
from wordcloud import WordCloud, STOPWORDS
import boto3

s3 = boto3.resource('s3',aws_access_key_id='AKIAIQWX5DQKB27UFMRA',aws_secret_access_key='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')

import sys

argument = sys.argv
pdfsource = argument[1]


# get data directory (using getcwd() is needed to support running example in generated IPython notebook)
d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()
file = open("/home/ubuntu/capstone-2020-3/server/"+pdfsource, 'rb')
# Read the whole text.
#text = open(path.join(d, 'test.txt')).read()

fileReader = pdftotext.PDF(file)
totalPage = len(fileReader)
# read the mask image
# taken from
# http://www.stencilry.org/stencils/movies/alice%20in%20wonderland/255fk.jpg
alice_mask = np.array(Image.open(path.join(d, "alice_mask.png")))

stopwords = set(STOPWORDS)
stopwords.add("said")

wc = WordCloud(font_path='/home/ubuntu/fonts/NanumGothic.ttf', background_color="white", max_words=2000, mask=alice_mask,
               stopwords=stopwords, contour_width=3, contour_color='steelblue')

text =""

for i in fileReader :
    text += i

# generate word cloud
wc.generate(text)

# store to file
wc.to_file(path.join(d, pdfsource+"_final.png"))

data = open('/home/ubuntu/'+pdfsource+'_final.png','rb')
s3.Bucket('portfoliosrc').put_object(Body=data,Key='portfolio_png/'+pdfsource+'/'+pdfsource+'_final.png',ACL='public-read')

os.system("rm "+pdfsource+'_final.png')
