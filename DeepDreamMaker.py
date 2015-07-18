#!/usr/bin/env python
import sys
#import DeepDreamThread
import DeepDreamThread
from PyQt4 import QtGui, QtCore, uic


class Window(QtGui.QMainWindow):

	inputImage = "" # input image path
	outputLoc  = ""	# output image path
	# arguments to pass to the python script
	# TODO: set and update them using the GUI
	ddArgs = {
		"preview-mode": True # chkPreviewMode
	}

	def __init__(self):
		super(Window, self).__init__()
		# gui.ui made with qt designer
		self.ui = uic.loadUi("gui.ui", self)
		# menu bar actions
		self.ui.actionAbout.triggered.connect(self.aboutMsg)
		self.ui.actionExit.triggered.connect(self.closeApp)
		# butons
		self.ui.btnInputFile.clicked.connect(self.openFile)
		self.ui.btnSetOutputLoc.clicked.connect(self.setOutputLoc)
		self.ui.btnMakeitDream.clicked.connect(self.makeItDream)
		self.ui.btnStopDream.clicked.connect(self.stopDream)

		self.ui.show()

	def openFile(self):
		"""
			Opens a file a file dialog to pick the input image
			A filter to only allow .png and .jpg images is used
			TODO: check file actually exits?
		"""
		self.inputImage = QtGui.QFileDialog.getOpenFileName(self, "Open File", "", "Images (*.png *.jpg)")
		if self.inputImage == "":
			self.ui.lblInputImg.setText("No image selected")
		else:
			self.ui.lblInputImg.setText(self.inputImage)
			
		self.enableMakeitDream()

	def setOutputLoc(self):
		"""
			Opens a file a file dialog to pick the DIRECTORY/FOLDER
			where the proccesed image is to be saved.
			TODO: check directory actually exits?
		"""
		self.outputLoc = QtGui.QFileDialog.getExistingDirectory(self, 'Select a folder:', '', QtGui.QFileDialog.ShowDirsOnly)
		if self.outputLoc == "":
			self.ui.lblOutputLoc.setText("No folder selected")
		else:
			self.ui.lblOutputLoc.setText(self.outputLoc)
		
		self.enableMakeitDream()

	def updateConsole(self, outputTxt):
		"""
			Updates the "console" (QPlainTextEdit) contents
		"""
		self.ui.consoleContainer.appendPlainText(outputTxt)

	def aboutMsg(self):
		"""
			Display a message box showing information about this application
			when the user clicks the "about" menu btn
		"""
		msgBoxTxt = "Deep Dream Maker v0.1\n\n"
		msgBoxTxt += "This application allows you to use Google's Deep Dream python script\n"
		msgBoxTxt += "without needed to use a command line\n\n"
		msgBoxTxt += "This is an open source project maintained by @overstruck\n\n"
		msgBoxTxt += "Repository: https://github.com/OverStruck/deep-dream-maker"

		msgBox = QtGui.QMessageBox()
		msgBox.setText(msgBoxTxt)
		msgBox.exec_()

	def closeApp(self):
		sys.exit()

	def enableMakeitDream(self):
		"""
			Enables the main button that initializes deep dream
			only if we have a valid input image path and an output directory
		"""
		if self.inputImage != "" and self.outputLoc !="":
			self.ui.btnMakeitDream.setEnabled(True)
		else:
			self.ui.btnMakeitDream.setDisabled(True)

	def stopDream(self):
		"""
			kills thread running current dream. Disables btnStopDream. Enables btnMakeitDream
		"""
		self.deepDreamThread.killSubProcess()

		self.ui.btnMakeitDream.setEnabled(True)
		self.ui.btnStopDream.setDisabled(True)

	def makeItDream(self):
		"""
			Main function that calls a thread class which calls Google's deep dream method
			We use a thread so that our user interface is not frozen and so that we can
			update our console with information about the current proccess
			# TODO error checking and catch any errors that might occur
		"""
		# disable make it dream btn
		self.ui.btnMakeitDream.setDisabled(True)
		# enable stop dream btn to kill process
		self.ui.btnStopDream.setEnabled(True)
		# need to convert from Qstring to a normal string
		inputImg = str(self.inputImage)
		outputLoc = str(self.outputLoc)

		self.deepDreamThread = DeepDreamThread.DeepDreamThread(self, inputImg, outputLoc, self.ddArgs)
		# connect signal to slot to listen for changes and update cosole contents
		self.deepDreamThread.consoleUpdated.connect(self.updateConsole)
		self.deepDreamThread.start()

def main():
	app = QtGui.QApplication([])
	Window()
	sys.exit(app.exec_())

main()
