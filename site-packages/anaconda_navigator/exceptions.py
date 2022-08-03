# -*- coding: utf-8 -*-

"""Navigator Exceptions and Exception handling module."""

import os
import tempfile
from traceback import format_exc
import typing
from urllib.request import pathname2url
import webbrowser
from anaconda_navigator.widgets.dialogs import MessageBoxError
from anaconda_navigator.utils.logs import logger


def display_qt_error_box(error, traceback):
    """Display a Qt styled error message box."""
    text = f'An unexpected error occurred on Navigator start-up<br>{error}'
    trace = f'{traceback}'
    msg_box = MessageBoxError(
        title='Navigator Start Error',
        text=text,
        error=trace,
        report=False,  # Disable reporting on github
        learn_more=None,
    )
    msg_box.setFixedWidth(600)
    return msg_box.exec_()


def display_browser_error_box(error, traceback):
    """Display a new browser window with an error description."""
    template = '''
    <html>
    <head>
      <title>Navigator Error</title>
    </head>
    <body>
      <div>
        <h1>Navigator Error</h1>
        <p>An unexpected error occurred on Navigator start-up</p>
        <h2>Report</h2>
        <p>Please report this issue in the anaconda
          <a href="https://github.com/continuumio/anaconda-issues">
            issue tracker
          </a>
        </p>
      </div>
      <div>
        <h2>Main Error</h2>
        <p><pre>{error}</pre></p>
        <h2>Traceback</h2>
        <p><pre>{trace}</pre></p>
      </div>
    </body>
    </html>
    '''

    file_descriptor: int
    file_path: str
    file_descriptor, file_path = tempfile.mkstemp(suffix='.html')

    file_stream: typing.TextIO
    with os.fdopen(file_descriptor, 'wt', encoding='utf-8') as file_stream:
        file_stream.write(template.format(error=error, trace=traceback))

    url = f'file:{pathname2url(file_path)}'

    webbrowser.open_new_tab(url)


def exception_handler(func, *args, **kwargs):
    """Handle global application exceptions and display information."""
    try:
        return_value = func(*args, **kwargs)
        if isinstance(return_value, int):
            return return_value
    except Exception as e:  # pylint: disable=broad-except,invalid-name
        return handle_exception(e)
    return None


def handle_exception(error):
    """This will provide a dialog for the user with the error found."""
    traceback = format_exc()
    logger.critical(error, exc_info=True)
    try:
        display_qt_error_box(error, traceback)
    except Exception as exc:  # pylint: disable=broad-except
        logger.exception(exc)
        display_browser_error_box(error, traceback)
