## "notification-view" custom element

This is a "notification-view" custom element

## Usage Instruction

https://webextension.org/custom-component/notification-view/index.html

![img](https://github.com/lunu-bounir/notification-view/blob/main/screenshot.png?raw=true)

## Public API

The `notification-view` custom element exposes two instance methods:

### `notify(content = 'Empty', type = 'info', timeout = 10000)`

Adds a new notification.

- `content` (string): message text to display.
- `type` (string): notification type. Supported values are `info`, `success`, `warning`, and `error`.
- `timeout` (number): time in milliseconds before auto-removal. Defaults to `10000`.

### `clean()`

Removes all active notifications from the component.

## Usage Examples

### Basic setup

```html
<notification-view id="notifications"></notification-view>
<script src="./notification-view.js"></script>
```

### Programmatically add notifications

```js
const view = document.getElementById('notifications');

view.notify('Saved successfully', 'success', 3000);
view.notify('Sync failed', 'error');
view.notify('New update available', 'info', 8000);
```

### Clear notifications

```js
const view = document.getElementById('notifications');
view.clean();
```

## License

"notification-view" custom element is an open-source project released under [MPL-2.0](https://github.com/lunu-bounir/notification-view/blob/master/LICENSE)
