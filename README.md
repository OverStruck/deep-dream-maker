# DeepDream Maker
**DeepDream Maker** is a GUI Interface wrapper for Google's Deep Dream and related python scripts

It allows you to easily dreamifty images without needing to use a terminal and provides a
flexible and intuitive way to customize your dreams by specifying different parameters

**Note:** currenly only tested in Ubuntu and Mint, not Windows or OSX

![](https://i.imgur.com/2Se5yC2.png)

[Demo Video](https://vimeo.com/134056032)

[Previous Image 1](https://i.imgur.com/E0aGgG6.png) | [Previous Image 2](https://i.imgur.com/WDzWfRE.png) | [Previous Image 3](https://i.imgur.com/MjHeCn2.png)

## Installation (Ubuntu 20.04)

You need to have [Deep Dream](https://github.com/google/deepdream) working, which means having all of its dependencies installed like caffe and [SciPy](https://www.scipy.org/install.html). You will also need python 2.7 and PyQt4.

### Install python 2.7
`sudo apt install python2 python2-dev`

If you get error `ImportError: No module named PIL.Image` you need to install Python Imaging Library (PIL)

Pip for Python 2 is not included in the Ubuntu 20.04 repositories. We’ll be installing pip for Python 2 using the get-pip.py script.

Use curl to download the get-pip.py script: `curl https://bootstrap.pypa.io/get-pip.py --output get-pip.py`

Run the script as sudo user with python2 to install pip for Python 2:
`sudo python2 get-pip.py`

Pip will be installed globally. If you want to install it only for your user, run the command without sudo. The script will also install setuptools and wheel, which allow you to install source distributions.

Once you have pip install, you can run `pip install image` to get rid of the error

### Install python PyQt4
The Qt4 framework has been removed from Ubuntu 20.04. You will need to manually compile and install. Please see:
[Installing PyQt4](https://het.as.utexas.edu/HET/Software/PyQt/installation.html)

To compile PyQt4 you will need SIP. You can download it using:

`wget https://www.riverbankcomputing.com/static/Downloads/sip/4.19.23/sip-4.19.23.tar.gz`
 
 Upzip: `tar -xvf sip-4.19.23.tar.gz ` and `cd sip-4.19.23`
 
 Then:
 `python configure.py` then `make` then `sudo make install`
 
 Now SIP should be installed. 
 
 #### Installing PyQt4 from source
 `wget https://www.riverbankcomputing.com/static/Downloads/PyQt4/4.12.3/PyQt4_gpl_x11-4.12.3.tar.gz`
 Unzip: `tar -xvf PyQt4_gpl_x11-4.12.3.tar.gz` then `cd PyQt4_gpl_x11-4.12.3`
 Now: 
 


## Contributing

You need to have [Deep Dream](https://github.com/google/deepdream) working, which means having all of its dependencies installed like caffe and [SciPy](https://www.scipy.org/install.html). You will also need python 2.7 and PyQt4.

The UI was made by using [Qt Designer](https://i.imgur.com/akMaZEy.png) because it is really fast and easy to use, aside from that fact that it is cross-platform compatible with Windows and OSx. You can edit the UI by editing the `GUI.ui` file. There's no need to compile anything, just saving your changes in Qt Designer will update the interface the next time you run the program since it is loaded dinamically. 

In Ubuntu/Mint you can get Qt Designer using [Software Manager](https://i.imgur.com/j0y1qHl.png)

You can install PyQt4 in Debian and "Ubuntus" distros (like mint) by doing

`sudo apt-get install python-qt4`

To run the program in your terminal:
```
cd deep-dream-maker
python -u DeepDreamMaker.py
```

Or just double click  DeepDreamMaker.py

I am using Sublime Text 3 to develop the software. If you are using it too, and you use `Crtl + B` to "build" your applications, you need to add caffe to your PATH so that when you run DeepDream Maker, you don't run into problems.
If you don't you will most likely run into `ImportError: No module named caffe`

See: https://stackoverflow.com/questions/28300286/sublime-importerror-no-module-named

You can do this by adding
```
{
	"shell_cmd": "python -u \"$file\"",
	"env": {
		"PYTHONPATH": "/home/YOU-USER-NAME/caffe/python"
	},
	"file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
    "selector": "source.python"
}
```

To your `.sublime-build` file. You can create a custom "build system" by going to **Tools->Build System->New Build System**. Don't forget to use your username (don't copy and paste blinly)

## Things do to
* ~~Add support for different arguments such as number of iterations (<b style="color:red">1st priority</b>)~~
    * ~~Add gui elements for different arguments (*checkboxes, etc...*)~~
* Add support to create animations (videos and gifs w/ option to zoom and rotate)
* Error checking
* Multi-proccesing support


## Requirements
You need to have Deep Dream working, which means having all of its dependencies installed like caffe.
You will also need python 2.7 and [PyQt4](https://wiki.python.org/moin/PyQt4)

To run the program in your terminal:
```
cd deep-dream-maker
python -u DeepDreamMaker.py
```

## Final thoughts
I will continue to work on this application in my free time. It really shouldn't be *that* hard to implement all the functionality I want since we are mostly just wrapping around Google's deep dream. To create animations I think we will also just need to wrap around ffmpeg using it in a subproccess and pasing it the user arguments.

Happy dreaming!
