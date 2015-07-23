import time
import PIL.Image
from cStringIO import StringIO
from base64 import b64decode
from PyQt4 import QtCore, QtGui
from PIL.ImageQt import ImageQt

class PreviewImagesFetcher(QtCore.QThread):

	newImageFound = QtCore.pyqtSignal(str)

	def __init__(self, q):
		super(PreviewImagesFetcher, self).__init__()
		self.q = q

	def run(self):
		while  True:
			if self.q.empty():
				time.sleep(0.5)
			else:
				newImg = self.q.get()
				self.q.task_done()
				print "fetched preview"
				self.newImageFound.emit(newImg)

class PreviewWindow(QtGui.QWidget):
	def __init__(self, mw, queue):
		super(PreviewWindow, self).__init__(mw)
		self.setWindowTitle("Deep Dream Maker Preview Image")
		self.queue = queue
		self.label = QtGui.QLabel()

		self.t = PreviewImagesFetcher(self.queue)
		self.t.daemon = True
		self.t.newImageFound.connect(self.setPreviewImg)
		self.t.start()

	def setPreviewImg(self, img):
		img = b64decode(img)
		img = StringIO(img)
		img = PIL.Image.open(img)
		#img = img.resize( (img.size[0], img.size[1]), PIL.Image.ANTIALIAS)
		#img.save("ajix.jpg", "jpeg")
		pixmap = QtGui.QPixmap.fromImage(ImageQt(img))
		#pixmap = QtGui.QPixmap(pixmap)
		pixmap = pixmap.scaled(self.label.size(), QtCore.Qt.KeepAspectRatio)

		#self.label.clear()
		#self.label.setFixedSize(img.size[0], img.size[1])
		self.label.setPixmap(pixmap)
		if self.label.isVisible() == False:
			self.label.show()
		print "updated preview"

"""
def main():
	app = QtGui.QApplication([])
	myQueue = Queue()
	myQueue.put("dreamified_SketchGuru_20150112172146.jpg")
	pw = PreviewWindow(myQueue)
	sys.exit(app.exec_())

if __name__ == '__main__':
	main()
"""