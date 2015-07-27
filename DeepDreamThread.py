import os
import time
import numpy as np

from PyQt4 import QtCore
from ctypes import c_bool
from multiprocessing import Process, Queue, Value
from DeepDreamWrapper import deepDreamMaker

class DeepDreamThread(QtCore.QThread):
	"""
	We use this class to keep the UI responsive by offloading the actual work
	to proccess the image to this thread. Doing this also allows us to update our UI
	"""

	# setup signals - they must be class vars, not instance vars
	threadDone = QtCore.pyqtSignal(bool)
	consoleUpdated = QtCore.pyqtSignal(str)
	progressBarUpdated = QtCore.pyqtSignal(int)
	previewImageUpdated = QtCore.pyqtSignal( np.ndarray )

	def __init__(self, mw, inputImg, outputLoc, ddArgs,):

		super(DeepDreamThread, self).__init__(mw)

		self.inputImg = inputImg	# input image PATH
		self.outputLoc = outputLoc	# output directory PATH
		self.ddArgs = ddArgs 		# options/arguments to pass 2 deepdream
		self.processKilled = Value(c_bool, False)

		self.fileName = self.getFileName(self.inputImg)
		self.outputFileName = self.getOutputFileName()

		self.setupQueues()
		self.startTimer()

	def setupQueues(self):
		self.progressBarQueue = Queue()
		self.previewImgQueue = Queue()
		
	def updateConsole(self, outputTxt):
		self.consoleUpdated.emit(outputTxt)

	def calcEndTime(self, startTime):
		timeCurrency = "seconds"
		endTime = float( time.time() - startTime ) # in seconds

		if endTime > 60.0:
			timeCurrency = "minutes"
			endTime = endTime / 60 # time in minutes

		return "##### Finished dreamifying \"%s\" in %.2f %s #####" % (self.fileName, endTime, timeCurrency)

	def getFileName(self, path):
		return os.path.basename(path)

	def getOutputFileName(self):
		fileName = self.fileName
		fileName = fileName.replace(".png", ".jpg")
		fileName = fileName.replace(".gif", ".jpg")
		return self.outputLoc + "/dreamified_" + fileName

	def killProcess(self):
		"""
		"Kills" deep dream proccess in deep dream thread
		We pass a shared boolean value to our proccess because we try to end the process
		in a safe way.
		If we were to use .terminate() it is possible for our queue data to become corrupted and
		the application can also freeze due to this
		"""
		with self.processKilled.get_lock():
			self.processKilled.value = True

	def checkProgressBarQueue(self):
		if self.progressBarQueue.empty() is False:
			progress = self.progressBarQueue.get()
			self.progressBarUpdated.emit( progress )

	def checkPreviewImgQueue(self):
		if self.previewImgQueue.empty() is False:
			preview = self.previewImgQueue.get()
			self.previewImageUpdated.emit( preview )

	def checkProgressQueues(self):
		self.checkProgressBarQueue()
		self.checkPreviewImgQueue()

	def startTimer(self):
		self.timer = QtCore.QTimer()
		self.timer.timeout.connect(self.checkProgressQueues)
		self.timer.start(10)

	def run(self):
		"""
		Main method automatically called.
		We just call the actual deep dream method from another script
		and we setup some variables to have some interesting info about
		how long it takes to proccess this image
		"""
		startTime = time.time()
		self.updateConsole("##### Started dreamifying \"%s\" #####" % self.fileName)

		self.ddProc = Process(target=deepDreamMaker, args=(self.processKilled, self.inputImg, self.outputFileName, 
			self.ddArgs, self.progressBarQueue, self.previewImgQueue) )

		self.ddProc.daemon = True
		self.ddProc.start()
		self.ddProc.join()

		self.timer.stop()

		if self.processKilled.value:
			self.updateConsole("###### Deep Dream Process %d killed ######" % self.ddProc.pid)
		else:
			#calculate proccess tim
			endMsg = self.calcEndTime(startTime)
			self.updateConsole(endMsg)

		# signal we are done!
		self.threadDone.emit(True)
