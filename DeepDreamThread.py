from PyQt4 import QtCore

import os
import time
import signal
from subprocess import Popen, PIPE, STDOUT

class DeepDreamThread(QtCore.QThread):
	"""
		We use this class to keep the UI responsive by offloading the actual work
		to proccess the image to this thread. Doing this also allows us to update our UI
	"""
	# signal to upate console output
	subprocessKilled = False
	consoleUpdated = QtCore.pyqtSignal(str)

	def __init__(self, mw, inputImg, outputLoc, ddArgs):
		super(DeepDreamThread, self).__init__(mw)
		self.inputImg = inputImg	# input image PATH
		self.outputLoc = outputLoc	# output directory PATH
		self.ddArgs = ddArgs # options/arguments to pass 2 deepdream
		# file name
		self.fileName = self.getFileName(self.inputImg)
		self.outputFileName = self.getOutputFileName()

	def run(self):
		"""
			Main method automatically called.
			We just cakk the actual deep dream method from another script
			and we setup some variables to have some interesting info about
			how long it takes to proccess this image
		"""
		startTime = time.time()
		self.updateConsole("##### Started dreamifying \"%s\" #####" % self.fileName)
		
		# we run the actual deepdream code in a subprocess in order to capture any and all
		# console output as if we were running it in a terminal
		# notice the -u flag in our command, it is required to capture the output in real time
		cmd = [
		"python -u DeepDreamWrapper.py",
		"-img \"%s\"" % self.inputImg, 
		"-oimg \"%s\"" % self.outputFileName
		]
		cmd = ' '.join(map(str, cmd))
		print cmd

		self.ddSubProc = Popen(cmd, stdout=PIPE, stderr=STDOUT, shell=True, bufsize=1, preexec_fn=os.setsid)
		while self.ddSubProc.poll() is None:
			line = self.ddSubProc.stdout.readline()
			if line:
				self.updateConsole(line)
		
		#calculate proccess time
		if not self.subprocessKilled:
			endMsg = self.calcEndTime(startTime)
			self.updateConsole(endMsg)

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
		return self.outputLoc + "/dreamified_" + fileName

	def killSubProcess(self):
		ddSubProcId = self.ddSubProc.pid
		os.killpg(ddSubProcId, signal.SIGTERM)
		self.subprocessKilled = True
		self.updateConsole("###### Deep Dream Sub Process %d killed ######" % ddSubProcId)