# Bootstrap Tour

[Bootstrap Tour][bootstrap-tour] is a javascript library that allows you to easily define a multi-page, highlighted feature tour using jQuery and Bootstrap.

## Requirements

* bootstrap - requires the modal and popover javascript libraries
* jquery - for events
* [jquery-expose][jquery-expose] - for highlighting various elements on the page

## Usage

Simplest usage:

```
var tour = new Tour([
  new TourStep("identifier", "Title1", "Content"),
  new TourStep("identifier2", "Title2", "Content")
])
```

### Tour

A tour definition can be an Array of `TourStep` objects or and Array of `TourGroup` objects. If you use `TourGroup` objects, the name of the `TourGroup` will be used as a optgroup label in the jumpTo menu.

Example:

```
var tour = new Tour([
  new TourGroup("Page 1", [
    new TourStep(…),
    new TourStep(…)
  ]),
  new TourGroup("Page 2", [
    new TourStep(…)
    ...
  ])
])
```

You can also pass in an intro `TourStep` as a second parameter that can be shown first before any other step.

```
var tour = new Tour([
  new TourStep(…),
  new TourStep(…)
],
new TourStep("intro", "Intro title", "Intro description")
)
```

### TourStep

A tour step requires 3 parameters:

* `id` - string - and identifier used to jump to a certain step
* `title` - string - the step title, can contain html
* `content` - string - the body of the step, can contain html

#### Options

The fourth parameter for a `TourStep` can be an options object with the following options:

* `type` - string - "popover" or "modal", defaults to "modal"
* `placement` - string - required if a "popover" type, where to place the popover, ("top", "bottom", "left", or "right")
* `anchor` - string - required if a "popover" type, jQuery selector of where to position the popover
* `expose` - string - jQuery selector of any elements to highlight using [jquery-expose][jquery-expose]
* `exposePadding` - integer - additional padding to include when highlighting elements
* `page` - function - if specified, expected to return a regex and a string. Before trying to show a step, it will check the regex against the current pathname and redirect to the string url if it doesn't match
* `beforeShow` - function - callback that runs before showing a step. if this method returns a truish value, then we abort the showing of the step.

### TourGroup

A tour group requires 2 parameters:

* `name` - string - header for the optgroup created for the jumpTo menu
* `steps` - array(TourStep) - the steps

## Enabling multi-page tours

After defining your tour add:

```
var match = RegExp('^#tour=([^&]*)').exec(window.location.hash);
if(match) {
  tour.show(match[1]);
}
```

This code will autostart the tour on the step specified in the anchor tag that matches #tour=[step_id]


[bootstrap-tour]: http://github.com/chingor13/bootstrap-tour
[jquery-expose]: http://github.com/chingor13/jquery-expose