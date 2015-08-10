#!/usr/bin/env python
import sys
import PIL.Image
import resources

from Queue import Queue
from PIL.ImageQt import ImageQt
from PyQt4 import QtGui, QtCore, uic
from DeepDreamThread import DeepDreamThread

class Window(QtGui.QMainWindow):
	# default arguments values for deepdream
	ddArgs = {
		"preview-image": False,
		"iterations": 10,	# iterations
		"octaves": 4,	# octaves
		"octaveScale": 1.4,	# octave scale
		"jitter": 32,	# jitter amount
		"stepSize": 1.5,	# step size
		"layers": "conv1/7x7_s2" # layer/blob
	}

	def __init__(self):
		super(Window, self).__init__()

		self.inputImg = ""
		self.outputLoc = ""
		# gui.ui made with qt designer
		self.ui = uic.loadUi("gui.ui", self)

		self.previewImages = Queue()
		self.pw = None
		self.connectSignals2Slots()

	def connectSignals2Slots(self):
		"connect gui elem signals with our slots"
		# menu bar actions
		self.ui.actionAbout.triggered.connect(self.displayAboutMsg)
		self.ui.actionExit.triggered.connect(self.closeApp)
		# butons
		self.ui.btnInputFile.clicked.connect(self.openFile)
		self.ui.btnSetOutputLoc.clicked.connect(self.setOutputLoc)
		self.ui.btnMakeitDream.clicked.connect(self.makeItDream)
		self.ui.btnStopDream.clicked.connect(self.stopDream)

		""" options/params"""
		# number of iterations
		self.ui.spboIternNum.valueChanged.connect(self.setIterNum)
		# number of octaves
		self.ui.spboOctNum.valueChanged.connect(self.setOctNum)
		# octave scale coefficient
		self.ui.spdbboScaCoeff.valueChanged.connect(self.setOctScaNum)
		# jitter amount
		self.ui.spboJittAmt.valueChanged.connect(self.setJitAmt)
		# step size
		self.ui.spdbboStpSize.valueChanged.connect(self.setStpSizeNum)
		# blob/layer name
		self.ui.cboBlobNames.currentIndexChanged.connect(self.setLayerName)
		# show preview image checkbox
		self.ui.chkPreviewImg.stateChanged.connect(self.setPreviewWin)
	
	def setPreviewWin(self):
		""" Set preview window checkbox value """
		self.ddArgs["preview-image"] = self.ui.chkPreviewImg.isChecked()

	def setIterNum(self, value):
		""" Set number of iterations """
		self.ddArgs["iterations"] = value

	def setOctNum(self, value):
		""" Set number of octaves """
		self.ddArgs["octaves"] = value

	def setOctScaNum(self, value):
		""" Set octave scale number """
		self.ddArgs["octaveScale"] = value

	def setJitAmt(self, value):
		""" Set jitter amount number """
		self.ddArgs["jitter"] = value

	def setStpSizeNum(self, value):
		""" Set step size number """
		self.ddArgs["stepSize"] = value

	def setLayerName(self, index):
		""" Set layer/blob name """
		self.ddArgs["layers"] = str(self.ui.cboBlobNames.currentText())

	def openFile(self):
		"""
		Opens a file dialog to pick the input image
		Filter only allows .png and .jpg images
		TODO: check file actually exits?
		"""
		self.inputImg = QtGui.QFileDialog.getOpenFileName(self, "Open File", "", "Images (*.png *.jpg)")
		if not self.inputImg:
			self.ui.lblInputImg.setText("No image selected")
		else:
			self.inputImg = str(self.inputImg) # from Qstring to reg string
			self.ui.lblInputImg.setText(self.inputImg)
			self.updatePreviewImg(src="path")
			
		self.enableMakeitDreamBtn()

	def setOutputLoc(self):
		"""
		Opens a file a file dialog to pick the DIRECTORY/FOLDER where the proccesed image is to be saved.
		TODO: check directory actually exits?
		"""
		self.outputLoc = QtGui.QFileDialog.getExistingDirectory(self, 'Select a folder:', '', QtGui.QFileDialog.ShowDirsOnly)
		
		if not self.outputLoc:
			self.ui.lblOutputLoc.setText("No folder selected")
		else:
			self.outputLoc = str(self.outputLoc) # from Qstring to reg str
			self.ui.lblOutputLoc.setText(self.outputLoc)
		
		self.enableMakeitDreamBtn()

	def updateConsole(self, outputTxt):
		""" Updates the "console" (QPlainTextEdit) contents """
		self.ui.consoleContainer.appendPlainText(outputTxt)

	def updateProgressBar(self, value):
		""" Updates progress bar values for animation """
		self.ui.progressBar.setValue(value)

	def updatePreviewImg(self, img=None, src=None):
		if src is None:
			img = PIL.Image.fromarray(img, "RGB")
		elif src == "path" and img == None:
			img = PIL.Image.open(self.inputImg).convert("RGB")

		img = self.resizePreviewImg(img)

		pixmap = QtGui.QPixmap.fromImage( ImageQt(img) )
		self.ui.previewImgLbl.setPixmap(pixmap)

	def resizePreviewImg(self, image):
		labelWidth = 550
		labelHeight = 390

		imAspect = float( image.size[0] ) / float( image.size[1] )
		outAspect = float( labelWidth ) / float( labelHeight )

		if imAspect >= outAspect:
			#set to labelWidth x labelWidth / imAspect
			return image.resize( ( labelWidth, int(( float(labelWidth) / imAspect) + 0.5)), PIL.Image.ANTIALIAS )
		else:
			#set to labelHeight * imAspect x labelHeight
			return image.resize( ( int((float( labelHeight ) * imAspect) + 0.5 ), labelHeight ), PIL.Image.ANTIALIAS )

	def displayAboutMsg(self):
		"""
		Display a message box showing information about this application
		when the user clicks the "about" menu btn
		"""
		
		msgBoxTxt = open("about.txt")

		msgBox = QtGui.QMessageBox()
		msgBox.setText(msgBoxTxt.read())
		msgBox.exec_()

	def ddThreadDone(self):
		"""
		This method runs when our deep dream thread is done or killed
		it enables our btnMakeitDream and disables btnStopDream
		"""
		self.ui.btnMakeitDream.setEnabled(True)
		self.ui.btnStopDream.setDisabled(True)

	def closeApp(self):
		sys.exit()

	def enableMakeitDreamBtn(self):
		"""
		Enables the main button that initializes deep dream
		only if we have a valid input image path and an output directory
		"""
		if self.inputImg != "" and self.outputLoc != "":
			self.ui.btnMakeitDream.setEnabled(True)
		else:
			self.ui.btnMakeitDream.setDisabled(True)

	def disableMakeitDreamBtn(self):
		# disable make it dream btn
		self.ui.btnMakeitDream.setDisabled(True)
		# enable stop dream btn to kill process
		self.ui.btnStopDream.setEnabled(True)

	def setupProgressBar(self):
		"""
		Updates our progress bar gui elem with correct values to give the user
		a proper estimate of the progress percentage so far
		"""
		# the total progress value to reach, this is akin to 100%
		totalBarProgress = int(self.ddArgs["iterations"]) * int(self.ddArgs["octaves"])

		self.updateProgressBar(0)
		self.ui.progressBar.setMaximum(totalBarProgress)
	
	def stopDream(self):
		""" kills thread running current dream. Disables btnStopDream. Enables btnMakeitDream """
		self.ui.btnStopDream.setDisabled(True)
		self.updateConsole("* Killing DeepDream proccess, please wait a little bit...")
		self.deepDreamThread.killProcess()

	def makeItDream(self):
		"""
		Main function that calls a thread class which calls Google'stepSize deep dream method
		We use a thread so that our user interface is not frozen and so that we can
		update our console with information about the current proccess
		# TODO error checking and catch any errors that might occur
		"""
		self.disableMakeitDreamBtn()
		self.setupProgressBar()

		self.deepDreamThread = DeepDreamThread(self, self.inputImg, self.outputLoc, self.ddArgs)
		# connect signal to slot to listen for changes and update cosole contents
		self.deepDreamThread.consoleUpdated.connect(self.updateConsole)
		# connect signal to slot to listen for progress bar progress
		self.deepDreamThread.progressBarUpdated.connect(self.updateProgressBar)
		# connect signal to slot to listen for preview image progress
		self.deepDreamThread.previewImageUpdated.connect(self.updatePreviewImg)
		# connect signal to slot to listen for when the thread is done
		self.deepDreamThread.threadDone.connect(self.ddThreadDone)
		self.deepDreamThread.start()

if __name__ == '__main__':
	deepDreamMaker = QtGui.QApplication(["Deep Dream Maker"])
	gui = Window()
	gui.show()
	sys.exit(deepDreamMaker.exec_())
