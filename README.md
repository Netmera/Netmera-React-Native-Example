# Netmera React Native Example

NETMERA is a Mobile Application Engagement Platform. We offer a series of development tools and app communication features to help your mobile business ignite and soar.

## Installation

`yarn add react-native-netmera`

or

`npm install --save react-native-netmera`

#### Link Netmera (for RN versions < 0.60)

Skip if using React Native version of 0.60 or greater.

React Native: `react-native link react-native-netmera`

For both native sides (Android & iOS) you don't have to include extra Netmera SDK libraries.

### Setup - Android Part

1) Create and register your app in [Firebase console](https://firebase.google.com/).

2) Download `google-services.json` file and place it into android/app/ folder.

3) In your project's build gradle file, add the following dependencies.

```
buildscript {
    repositories {
        google()
        mavenCentral()
        maven {url 'https://developer.huawei.com/repo/'}
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.3'
        classpath 'com.google.gms:google-services:4.3.10'
        classpath 'com.huawei.agconnect:agcp:1.6.3.300'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://maven.google.com'}
        maven { url 'https://developer.huawei.com/repo/'}
        maven { url "https://release.netmera.com/release/android" }
    }
}
```

4) In your app's build gradle file, add the following dependency.

```

 dependencies {

     implementation 'androidx.core:core:1.9.0'
     
 }
```

5) Add the following into the top of app's build.gradle file.

```
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.huawei.agconnect'
```

6) Create an application class as shown below.

- Initialize Netmera SDK in your Application class.

``` 
    public class MainApplication extends Application {
    
        @Override
        public void onCreate() {
            super.onCreate();
            RNNetmeraConfiguration netmeraConfiguration = new RNNetmeraConfiguration.Builder()
                .firebaseSenderId(<YOUR GCM SENDER ID>)
                .huaweiSenderId(<YOUR HMS SENDER ID>)
                .apiKey(<YOUR NETMERA API KEY>)
                .logging(true) // This is for enabling Netmera logs.
                .build(this);
            RNNetmera.initNetmera(netmeraConfiguration);
        }
    }
```

### Setup - iOS Part

1) Navigate to ios folder in your terminal and run the following command.

```
$ pod install
```

2) Download `GoogleService-Info.plist` file from Firebase and place it into ios/ folder.

3) Enable push notifications for your project

   1) If you have not generated a valid push notification certificate yet,
      generate one and then export by following the steps explained in [Configuring Push Notifications section of App Distribution Guide](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns#2947597)
   2) Export the generated push certificate in .p12 format and upload to Netmera Dashboard.
   3) Enable Push Notifications capability for your application as explained in [Enable Push Notifications](https://developer.netmera.com/en/IOS/Quick-Start#enable-push-notifications) guide.
   4) Enable Remote notifications background mode for your application as explained in [Configuring Background Modes](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038) guide.


4) If you want to use Android alike message sending from iOS to react native please consider shaping your AppDelegate class as following.

#### AppDelegate.h
```
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <Netmera/Netmera.h>
#import <NetmeraCore/NetmeraPushObject.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate, NetmeraPushDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
```

#### AppDelegate.m

- Add the following to the top of AppDelegate.m file.

```
#import <RNNetmera/RNNetmeraRCTEventEmitter.h>
#import <RNNetmera/RNNetmeraUtils.h>
#import <RNNetmera/RNNetmera.h>
```

- Add the following lines into the `didFinishLaunchingWithOptions` method.

```

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Add this line to set notification delegate
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;

  ...
  
  // Add these lines to init Netmera
  [RNNetmera logging: YES]; // This is for enabling Netmera logs.
  [RNNetmera initNetmera:[<YOUR NETMERA API KEY>]]; // Replace this with your own NETMERA API KEY.
  [RNNetmera requestPushNotificationAuthorization];
  [RNNetmera setPushDelegate:self];
  [Netmera setAppGroupName:<YOUR APP GROUP NAME>]; // Set your app group name
  
  return YES;
}
```

- Add these methods to between `@implementation AppDelegate` and `@end`.

```
@implementation AppDelegate

...

// MARK: Push Delegate Methods

// Take push payload for Push clicked:
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  if ([response.actionIdentifier isEqual:UNNotificationDismissActionIdentifier]) {
    [RNNetmeraRCTEventEmitter onPushDismiss: @{@"userInfo" : response.notification.request.content.userInfo}];
  } else if ([response.actionIdentifier isEqual:UNNotificationDefaultActionIdentifier]) {
    [RNNetmeraRCTEventEmitter onPushOpen: @{@"userInfo" : response.notification.request.content.userInfo}];
  }
  completionHandler();
}

// Take push payload for push Received on application foreground:
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert);
  [RNNetmeraRCTEventEmitter onPushReceive: @{@"userInfo" : notification.request.content.userInfo}];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  if(deviceToken == nil) {
    return;
  }
  [RNNetmeraRCTEventEmitter onPushRegister: @{@"pushToken" : deviceToken}];
}

@end

```
For example if you trigger `[RNNetmeraRCTEventEmitter onPushReceive: @{@"userInfo" : notification.request.content.userInfo}]` from AppDelegate, in the react native part the following method will be triggered.
```
export const onPushReceive = async (message) => {
    console.log("onPushReceive: ", message);
};
```

4) In order to use iOS10 Media Push, follow the instructions in [Netmera Product Hub.](https://developer.netmera.com/en/IOS/Push-Notifications#using-ios10-media-push) Differently, you should add the pods to the top of the `Podfile` as below.

   ```
   // For receiving Media Push, you must add Netmera pods to top of your Podfile.
   pod "Netmera", "3.14.10-WithoutDependency"
   pod "Netmera/NotificationServiceExtension", "3.14.10-WithoutDependency"
   pod "Netmera/NotificationContentExtension", "3.14.10-WithoutDependency"
   ```

### Setup - React Native Part

1) Create a new `NetmeraPushHeadlessTask.js` inside your React Native project.

```
export const onPushRegister = async (message) => {
    console.log("onPushRegister: ", message);
};

export const onPushReceive = async (message) => {
    console.log("onPushReceive: ", message);
};

export const onPushOpen = async (message) => {
    console.log("onPushOpen: ", message);
};

export const onPushDismiss = async (message) => {
    console.log("onPushDismiss: ", message);
};

export const onPushButtonClicked = async (message) => {
    console.log("onPushButtonClicked: ", message);
};

export const onCarouselObjectSelected = async (message) => {
    console.log("onCarouselObjectSelected: ", message);
};
```

2) Init `NetmeraBroadcastReceiver` inside your `index.js` file.

```
import {
    onCarouselObjectSelected,
    onPushButtonClicked,
    onPushDismiss,
    onPushOpen,
    onPushReceive,
    onPushRegister
} from "./NetmeraPushHeadlessTask";

Netmera.initBroadcastReceiver(
    onPushRegister,
    onPushReceive,
    onPushOpen,
    onPushDismiss,
    onPushButtonClicked,
    onCarouselObjectSelected
)
   
// This should be called after Netmera.initBroadcastReceiver method.
AppRegistry.registerComponent(appName, () => App);
```

3) If you have custom Firebase Messaging integration, please see usage below.

```
messaging()
   .getToken(firebase.app().options.messagingSenderId)
   .then(pushToken => {
       Netmera.onNetmeraNewToken(pushToken)
});

messaging().onMessage(async remoteMessage => {
   if (Netmera.isNetmeraRemoteMessage(remoteMessage.data)) {
       Netmera.onNetmeraFirebasePushMessageReceived(remoteMessage.from, remoteMessage.data)
   }
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    if (Netmera.isNetmeraRemoteMessage(remoteMessage.data)) {
        Netmera.onNetmeraFirebasePushMessageReceived(remoteMessage.from, remoteMessage.data)
    }
});

```

4) If you have custom Huawei Messaging integration, please see usage below.

```
HmsPushInstanceId.getToken("")
   .then((result) => {
       Netmera.onNetmeraNewToken(result.result)
   })

HmsPushEvent.onRemoteMessageReceived(event => {
   const remoteMessage = new RNRemoteMessage(event.msg);
   let data = JSON.parse(remoteMessage.getData())
   console.log("onRemoteMessageReceived", data)
   if (Netmera.isNetmeraRemoteMessage(data)) {
       Netmera.onNetmeraHuaweiPushMessageReceived(remoteMessage.getFrom(), data)
   }
})
```


### Calling React Native methods

##### Update User Example

```
const updateUser = () => {
    const user = new NetmeraUser();
    user.userId = <userId>;
    user.name = <name>;
    user.surname = <surname>;
    user.msisdn = <msisdn>;
    user.gender = <gender>;
    Netmera.updateUser(user)
}
```

##### Sending Event Examples

You can send your events as follows. For more examples, please see the [example project](https://github.com/Netmera/Netmera-React-Native-Example/blob/master/src/Screens/Event.js).

```
  const sendLoginEvent = () => {
    const loginEvent = new LoginEvent();
    loginEvent.setUserId(<userId>);
    Netmera.sendEvent(loginEvent)
  }

  const sendRegisterEvent = () => {
    const registerEvent = new RegisterEvent();
    Netmera.sendEvent(registerEvent)
  }

  const sendViewCartEvent = () => {
    const viewCartEvent = new ViewCartEvent();
    viewCartEvent.subTotal = <subTotal>;
    viewCartEvent.itemCount = <itemCount>;
    Netmera.sendEvent(viewCartEvent)
  }
```

##### Push Notification Permissions

If you don't request notification permission at runtime, you can request it by calling the `requestPushNotificationAuthorization()` method.
Note: Notification runtime permissions are required on Android 13 (API 33) or higher.
Therefore, before calling the method, make sure your project targets an API of 33 and above.

```
 Netmera.requestPushNotificationAuthorization();
```

You can call the `areNotificationsEnabled()` method if you need to know the status of permissions.

``` 
 await Netmera.areNotificationsEnabled() // Use the enabled status of permission as boolean
```

##### Netmera Inbox Examples

You can fetch the Netmera inbox as following. For more detailed usage, please see the [example project](https://github.com/Netmera/Netmera-React-Native-Example/blob/master/src/Screens/PushInbox.js).

```
 const fetchInbox = async () => {
     try {
         const netmeraInboxFilter = new NetmeraInboxFilter();
         netmeraInboxFilter.status = Netmera.PUSH_OBJECT_STATUS_UNREAD;
         netmeraInboxFilter.pageSize = 2; // Fetch two push object
         const inbox = await Netmera.fetchInbox(netmeraInboxFilter);
         console.log("inbox", inbox);
     } catch (e) {
         console.log("error", e)
     }
 }
```

##### Netmera Inbox Category Examples

You can fetch the Netmera category as following. For more detailed usage, please see the [example project](https://github.com/Netmera/Netmera-React-Native-Example/blob/master/src/Screens/Category.js).

```
 const fetchCategory = async () => {
     try {
         const netmeraCategoryFilter = new NetmeraCategoryFilter()
         netmeraCategoryFilter.status = categoryState
         netmeraCategoryFilter.pageSize = 1 // Fetch one by one
         const categories = await Netmera.fetchCategory(netmeraCategoryFilter)
         console.log("categories", categories);
         setCategories(categories)
     } catch (e) {
         console.log("error", e)
     }
 };
```

##### Netmera Getting ExternalId (if exists before)

```
    Netmera.currentExternalId()
```

##### Netmera Popup Presentation
To enable popup presentation, you need to call the `enablePopupPresentation()` method on the page where you want to display the popup.
Note: To show popup on the app start or everywhere in the app, please add this to `index.js` file.
```
 Netmera.enablePopupPresentation();
```

Please explore example project for detailed information.
