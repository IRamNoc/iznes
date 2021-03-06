# UserTour Directive
UserTour is a directive for use across Setl projects. The directive takes a config object and displays tooltip style signpost elements to the UI to guide the user through a particular feature or component. 

Features:
* Easy to setup - just import, wrap the HTML you want to use in a div with the directive on, create the config object and away you go
* Works across components - the directive uses DOM manipulation after the view has been rendered so as long as all components have been wrapped in
the div containing the directive it will work
* Make a tour step 'must complete' so the user has to complete an action before proceeding. Pass a callback function that returns a boolean to control
when the user can proceed
* The position of the signpost on the UI is calculated automatically or can be set manually in the config
* Adds a blue `?` UI icon to the DOM so users can launch the Tour. Or turn this off and use a custom trigger on the component
* Call methods on the directive from your component to launch, close or move through the UserTour
* Plus other settings can be controlled from the config...

# Usage:
## 1. Import the `SetlDirectivesModule`

Import the `SetlDirectivesModule` into your module by using an import statement and adding it to the imports array

```typescript
import { SetlDirectivesModule } from '@setl/utils/directives/index';

@NgModule({
    imports: [
        SetlDirectivesModule,
    ]
})
```

## 2. Setting up the `UserTourDirective`.

Set up a config object to pass to the UserTourDirective. Below is an example of a minimal setup:

```typescript
    public tourConfig: any = {
        tourName: 'usertour_example',
        stages: {
            stage1: {
                title: 'Example Tour Title 1',
                text: 'Example User Tour Text 1',
            },
            stage2: {
                title: 'Example Tour Title 2',
                text: 'Example UserTour Text 2',
            },
        },
    };
```

## 3. Implementing the `userTour` directive.

**Note: you'll have to import the `SetlDirectivesModule` into the module that your component is declared in.**

Wrap all of the HTML you want to setup the User Tour for in a `<div>` containing the directive and feed it the config you have created:

```html
<div [userTour]="tourConfig">
    <h1>Your content to tour</h1>
    <p>Example content</p>
    ...
</div>
```

Then wrap each element you want to pick out as a stage of the User Tour in a `<div>` with an ID that matches the corresponding key of the stage name
in the config object:

```html
<div [userTour]="tourConfig">
    <div id="stage1">
        <h1>Your content to tour</h1>
    </div>
    <div id="stage2">
       <p>Example content</p>
   </div>
    ...
</div>
```
That's it! You're up and running.

# Config Settings
There are a number of useful settings you can control in the config object:
<br>*? at the end of a property name means it's optional*
```typescript
{
    tourName: 'string',
    // Unique name of the User Tour
    
    autostart?: 'boolean',
    // TRUE autostarts every load, FALSE never autostarts AND omitting launches it on first view
    // (first view only is controlled by saving to tblUserPrefence once a tour has been closed)

    createIcon?: 'boolean',
    // Controls whether to create the `?` UI trigger icon. TRUE by default
    
    stages: {
        
        [stageName: string]: {
            // Name of the stage which must match the id of the div wrapping the child element in the HTML
            
            title: 'string',
            // Title displayed on the tour stage signpost. This will be passed through the translation service
            
            text: 'string',
            // Text displayed on the tour stage signpost. This will be passed through the translation service
            
            mustComplete?: () => {};
            // Pass a callback function that returns a boolean to determine if a user can move past this stage.
            // If omitted must complete is not set
            
            highlight?: boolean;
            // Highlights the child stage element with a white background
            
            position?: PositionEnum;
            // Sets a position for the signpost, otherwise it is calculated automatically
            
            preserveWidth?: boolean;
            // Preserve the width of the child stage element (use if the tour styles effect the child element width)
        },
        ...
        // Repeat for as many stages as required
    }
}

enum PositionEnum {
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'left-top',
    'left-middle',
    'left-bottom',
}

```
# Applying custom functionality

## 1. Trigger actions based on the current stage number of the tour
The current stage number is emitted from the directive so you can hook into it and trigger custom functionality on your component. Just tap into the `(stage)` output:
```html
<div [userTour]="tourConfig" (stage)="myCustomFunction($event)">
```

## 2. Call methods on the UserTour directive

Import the directive and using `@ViewChild` you can call any of it's methods directly from your component to control launching, closing and moving through stages of the tour:

```typescript
import { ViewChild } from '@angular/core';
import { UserTourDirective } from '@setl/utils/directives/user-tour/user-tour.directive';

@ViewChild(UserTourDirective) userTour;
```

After the view has rendered, you can then access any of the below methods:

```typescript
this.userTour.launchUserTour(); // Launches the UserTour

this.userTour.closeUserTour(); // Closes the UserTour

this.userTour.prepNextStage(); // Moves to the next step of the tour

this.userTour.prepPrevStage(); // Moves to the previous step of the tour

```
*Note, use `@ViewChildren` instead if you are using multiple UserTours on the same component, and then access the methods above like `this.userTour.first.launchUserTour` where `.first` is the first UserTour directive and `.second` is the second etc.*