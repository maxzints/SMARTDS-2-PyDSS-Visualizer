"""Notification utilities."""

import typing

from qtpy.QtCore import QObject, Signal  # pylint: disable=no-name-in-module

if typing.TYPE_CHECKING:
    import typing_extensions
    from qtpy import QtWidgets


class NotificationQueue(QObject):
    """Notification dialogs queue."""
    sig_item_added = Signal()

    def __init__(self):
        """Initialize new :class:`~NotificationQueue` instance."""
        super().__init__()

        self.__queue: 'typing_extensions.Final[typing.List[QtWidgets.QDialog]]' = []

    @property
    def queue(self) -> typing.List['QtWidgets.QDialog']:
        """Inner queue container."""
        return self.__queue

    def add(self, dialog: 'QtWidgets.QDialog') -> None:
        """Append a dialog to the queue."""
        self.__queue.append(dialog)
        self.sig_item_added.emit()

    def pop(self, index: int = -1) -> 'QtWidgets.QDialog':
        """Remove a queue item at `index`."""
        return self.__queue.pop(index)


NOTIFICATIONS_QUEUE = NotificationQueue()
