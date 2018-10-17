# it2810-webutvikling-h18-prosjekt-3-35

### Private Muscle Manager (PMM)
PMM is an iOS and Android application that motivates the user to create exercises and add information about a session to the exercise. This data wil be used to plot the progress towards a goal and all of the sessions. The application will also include a pedometer and a goal. This will motivate the user to achieve and overall health goal and not just muscle.

### Functionality

### Design
We are basing a lot of the design on Google's material design and using the third party library Paper which allows for easy implementation of the material design guidelines.

### Testing (Jest)

### Git

#### Projects
We are using Github's Projects functinality where we have seperated the project into 5 parts, 'To Do', 'Implementing Functionality', 'Implementing Style', 'Implementing Tests', and 'Done'. Where one card from to do will be dragged between them if appropriate. This means that the card 'Implement Jest (Testing)' won't be put in 'Implementing Style' since it is not deemed necessary.

#### Issues
All the cards from Projects have been used to create issues, the issues will be added in commits. If someone has forgotten to reference the issue in an commit they will comment on the issue/commit and tag the appropriate issue/commit it references.

### Known bugs
- When going to the screen to change a daily goal and press OK it would crash, but changing the value (even to the same as it used to be) would not make it crash. Solved by disabling the button when not changing it.

### External libraries
- https://github.com/mmazzarolo/react-native-modal-datetime-picker
- https://github.com/JesperLekland/react-native-svg-charts
    - (Depends on) https://github.com/react-native-community/react-native-svg
- https://github.com/callstack/react-native-paper
