from os import path
import numpy as np
import boto3
import matplotlib
import os
import pdftotext
import sys
import json
from PIL import Image
from wordcloud import WordCloud, STOPWORDS
s3 = boto3.resource('s3',aws_access_key_id='AKIAIQWX5DQKB27UFMRA',aws_secret_access_key='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')


argument = sys.argv

pdf_name = argument[1]
route = "./{}".format(pdf_name)
# get data directory (using getcwd() is needed to support running example in generated IPython notebook)
d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()
file = open(route, 'rb')
# Read the whole text.
#text = open(path.join(d, 'test.txt')).read()

fileReader = pdftotext.PDF(file)
totalPage = len(fileReader)
# read the mask image
# taken from
#alice_mask = np.array(Image.open(path.join(d, "alice_mask.png")))

stopwords = set(STOPWORDS)
stopwords.add("said")

wc = WordCloud(font_path='/home/ubuntu/fonts/NanumGothic.ttf', background_color="white", max_words=2000,
               stopwords=stopwords, contour_width=3, contour_color='steelblue')


text =""

for i in fileReader :
    text += i

# generate word cloud
wc.generate(text)

# store to file
#wc.to_file(path.join(d, ))


#TEXT에서 해당 단어와 빈도수 가중치를 보여준다. 여기서 이제 LIST에 담아서 TOP 5 RETURN 해야 함. BY락준
#print(wc.words_)

sort_value = sorted(wc.words_.items(),reverse=True,key=lambda item: item[1])
count = 0
result={}
result['contents']=[]
for item in sort_value:
	count += 1
	result['contents'].append(item[0])
	print(item[0])
	if count==5:
		break
    
with open('result.txt','w',encoding='utf-8') as outfile:
	json.dump(result,outfile)
data = open('result.txt','rb')
print(data)
s3.Bucket('portfoliosrc').put_object(Body=data,Key='portfolio_pdf/'+pdf_name+'.txt',ACL='public-read')

