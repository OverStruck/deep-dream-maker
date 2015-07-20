# DeepDream Maker
**DeepDream Maker** is a GUI Interface wrapper for Google's Deep Dream and related python scripts

It allows you to easily dreamifty images without needing to use a terminal and provides a
flexible and intuitive way to customize your dreams by specifying different parameters

**Note:** currenly only tested in Ubuntu and Mint, not Windows or OSX

![](https://i.imgur.com/WDzWfRE.png)

[Previous Image](https://i.imgur.com/E0aGgG6.png)

## Please contribute
I am putting this here so that all of you can contribute to its development to make a first beta version faster.

The program currently works, but it is using a very crude version of Google's original python script. Needless to say, you can chose an image, an output folder, dreamify the image and kill the process if needed, which is more than enough for testing purposes.

The UI was made by using [Qt Designer](https://i.imgur.com/akMaZEy.png) because it is really fast and easy to use, aside from that fact that it is cross-platform compatible with Windows and OSx. You can edit the UI by editing the `GUI.ui` file. There's no need to compile anything, just saving your changes in Qt Designer will update the interface the next time you run the program since it is loaded dinamically. In Ubuntu/Mint you can get Qt Designer using [Software Manager](https://i.imgur.com/j0y1qHl.png)

## Things do to
* Add support for different arguments such as number of iterations (<b style="color:red">1st priority</b>)
    * ~~Add gui elements for different arguments (*checkboxes, etc...*)~~
* Add support to create animations (videos and gifs w/ option to zoom and rotate)
* Error checking
* Multi-threading support


## Requirements
You need to have Deep Dream working, which means having all of its dependencies installed like caffe.
You will also need python 2.7 and [PyQt4](https://wiki.python.org/moin/PyQt4)

To run the program in your terminal:
```
cd deep-dream-maker
python -u DeepDreamMaker.py
```
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

## Final thoughts
I will continue to work on this application in my free time. It really shouldn't be *that* hard to implement all the functionality I want since we are mostly just wrapping around Google's deep dream. To create animations I think we will also just need to wrap around ffmpeg using it in a subproccess and pasing it the user arguments.

Happy dreaming!
