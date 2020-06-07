#! /usr/bin/python3.7
# -*- coding: utf-8 -*-

# Author: Andrii Valchuk
import boto3
import time
from wand.image import Image as wimg
from progress.bar import IncrementalBar
import sys
import os
s3 = boto3.resource('s3',aws_access_key_id='AKIAIQWX5DQKB27UFMRA',aws_secret_access_key='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')



argument = sys.argv
pdfsource = argument[1]

print(pdfsource)


imgresolution = 100


# pdf = 으로 경로를 받아오는 과정에 있어서 문제가 있는 것 같음 

try:
	print('check  ../'+pdfsource)
	pdf = wimg(filename='/home/ubuntu/capstone-2020-3/server/'+pdfsource, resolution=imgresolution)
	pdfimage = pdf.convert("png")
	imgsequence = pdfimage.sequence
	bar = IncrementalBar('Convert', max = len(imgsequence))
	i = 1
	for img in imgsequence:
		print("Iterating")
		time.sleep(1)
		bar.next()
		page = wimg(image=img)	
		page.save(filename=str(i)+".png")
		i += 1
	bar.finish()
	i=i-1
	print("siz of  portfolio : "+str(i))
		
	for j in range(i):	
		pNum = str(i)
		pName= str(j+1)
		data = open(pName+'.png','rb')
		
		s3.Bucket('portfoliosrc').put_object(Body=data,Key='portfolio_png/'+pdfsource+'/'+pName+'.png',ACL='public-read')



	for j in range(i):
		os.system("rm "+str(j+1)+".png")

	print("Finish\n")
except PolicyError as ex:
	print('Pdf extraction forbidden by Imagemagick policy: %s', ex)
except Exception as ex:
	print('Cannot extract image: %s', ex)
