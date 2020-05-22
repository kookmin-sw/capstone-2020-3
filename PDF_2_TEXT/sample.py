
'''
from PyPDF2 import PdfFileReader

pdf_file  = open('test.pdf','rb')
read_pdf = PdfFileReader(pdf_file)

text=[]

for i in range(0,read_pdf.getNumPages()-1):
                 text.append(read_pdf.getPage(i).extractText())

print(text)

'''

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO

def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec_ = 'utf-8'
    laparams = LAParams()
#    device = TextConverter(rsrcmgr, retstr, codec=codec_, laparams=laparams)
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)

    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos=set()
    
    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
        interpreter.process_page(page)
        text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()
    return text
    
extracted_text = convert_pdf_to_txt('test.pdf')
print(extracted_text)
