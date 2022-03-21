# Netmera React Native Example

NETMERA is a Mobile Application Engagement Platform. We offer a series of development tools and app communication features to help your mobile business ignite and soar.

## Installation

Netmera React Native SDK is available through [NPM](https://www.npmjs.com/package/react-native-netmera).

`$ npm install react-native-netmera --save`

### Mostly automatic installation

`$ react-native link react-native-netmera`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-netmera` and add `RNNetmera.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNetmera.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
- Add `import com.netmera.reactnativesdk.RNNetmeraPackage;` to the imports at the top of the file
- Add `new RNNetmeraPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-netmera'
   project(':react-native-netmera').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-netmera/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
   implementation project(':react-native-netmera')
   ```

For both native sides(Android & iOS) you don't have to include extra Netmera SDK libraries.

### Setup - Android Part

1) Create and register your app in [Firebase console](https://firebase.google.com/).

2) Download `google-services.json` file and place it into android/app/ folder.

3) In your project's build gradle file, add the following dependency.

```
buildscript {
    repositories {
        google()
        jcenter()
        maven {url 'http://developer.huawei.com/repo/'}
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.3'
        classpath 'com.google.gms:google-services:4.3.5'
        classpath 'com.huawei.agconnect:agcp:1.4.2.300'
    }
}

allprojects {
    repositories {
        google()
        jcenter()
        maven { url 'https://maven.google.com'}
        maven {url 'http://developer.huawei.com/repo/'}
    }
}
```

4) In your app's build gradle file, add the following dependency.

```

 dependencies {
 
     implementation 'androidx.core:core:1.1.0'
     
 }
```

5) Add the following into the bottom of app's buid.gradle file

```
apply plugin: 'com.google.gms.google-services'
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
                .apiKey(<YOUR NETMERA API KEY>)
                .logging(true) // This is for enabling Netmera logs.
                .build(this);
            RNNetmera.initNetmera(netmeraConfiguration);
        }
    }
```

7) Create a new `NetmeraPushHeadlessTask.js` inside your React Native project.

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
```

8) Init `NetmeraBroadcastReceiver` inside your `index.js` file.

```
   import { onPushButtonClicked,
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
         onPushButtonClicked
   )
   
   // This should be called after Netmera.initBroadcastReceiver method.
   AppRegistry.registerComponent(appName, () => App);
```

### Setup - iOS Part

1) Navigate to ios folder in your terminal and run the following command.

```
$ pod install
```

2) If you want to use Android alike message sending from iOS to react native please consider shaping your AppDelegate class as following.

```
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNNetmera/RNNetmeraRCTEventEmitter.h>
#import <RNNetmera/RNNetmeraUtils.h>
#import <RNNetmera/RNNetmera.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"example"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNNetmera logging: YES]; // This is for enabling Netmera logs.
  [RNNetmera initNetmera:@"<apiKey>"];
  [RNNetmera requestPushNotificationAuthorization];
  [RNNetmera setPushDelegate:self];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

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
Please take a look at `Setup-Android part 7`


### Calling React Native methods

##### Update User Example

```
updateUser() {
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

```
  void sendLoginEvent() {
    const loginEvent = new LoginEvent();
    loginEvent.setUserId(<userId>);
    Netmera.sendEvent(loginEvent)
  }

  void sendRegisterEvent() {
    const registerEvent = new RegisterEvent();
    Netmera.sendEvent(registerEvent)
  }

  void sendViewCartEvent() {
    const viewCartEvent = new ViewCartEvent();
    viewCartEvent.subTotal = <subTotal>;
    viewCartEvent.itemCount = <itemCount>;
    Netmera.sendEvent(viewCartEvent)
  }

  void purchaseEvent() {
    const netmeraLineItem = new NetmeraLineItem();
    netmeraLineItem.setBrandId(<brandId>);
    netmeraLineItem.setBrandName(<brandName>);
    netmeraLineItem.setCampaignId(<campaignId>);
    netmeraLineItem.setCategoryIds(<categoryIds>);
    netmeraLineItem.setCategoryNames(<categoryNames>);
    netmeraLineItem.setKeywords(<keywords>);
    netmeraLineItem.setCount(<count>);
    netmeraLineItem.setId(<id>);
    netmeraLineItem.setPrice(<price>);

    const purchaseEvent = new CustomPurchaseEvent();
    purchaseEvent.coupon = <coupon>;
    purchaseEvent.discount = <discount>;
    purchaseEvent.grandTotal = <grandTotal>;
    purchaseEvent.itemCount = <itemCount>;
    purchaseEvent.paymentMethod = <paymentMethod>;
    purchaseEvent.subTotal = <subTotal>;
    purchaseEvent.shippingCost = <shippingCost>;
    purchaseEvent.purchaseLineItemEvent = [netmeraLineItem, netmeraLineItem];
    purchaseEvent.userName = <userName>;
    Netmera.sendEvent(purchaseEvent)
  }
```
##### Netmera Inbox Examples

```
   constructor() {
        super();
        this.state = {
            inbox: [],
            inboxState: Netmera.PUSH_OBJECT_STATUS_ALL,
            countForStatus: 0
        }
    }

    fetchInbox = async () => {
        try {
            const netmeraInboxFilter = new NetmeraInboxFilter();
            netmeraInboxFilter.status = this.state.inboxState;
            netmeraInboxFilter.pageSize = 2;
            const inbox = await Netmera.fetchInbox(netmeraInboxFilter);
            console.log("inbox", inbox);
            this.setState({inbox: inbox});
        } catch (e) {
            console.log("error", e)
        }
    };

    fetchNextPage = async () => {
        try {
            const inbox = await Netmera.fetchNextPage();
            this.setState({inbox: inbox});
            console.log("inbox", inbox)
        } catch (e) {
            console.log("error", e)
        }
    };

    updateAll = async () => {
        if (!this.state.inbox !== undefined) {
            let updateStatus = this.state.inboxState;
            if (updateStatus === Netmera.PUSH_OBJECT_STATUS_ALL) {
                Alert.alert("Error", "Please select different status than all!!")
                console.log("Please select different status than all!!");
                return;
            }

            try {
                Netmera.updateAll(this.state.inboxState).then(() => {
                    this.fetchInbox();
                }).catch((error) => {
                    console.log("error: " + error)
                })
            } catch (error) {
                console.log("error: " + error)
            }
        }
    };

    handlePushObject = async () => {
        if (this.state.inbox !== undefined && this.state.inbox.length > 0) {
            Netmera.handlePushObject(this.state.inbox[0].pushId)
        }
    };

    handleInteractiveAction = async () => {
        if (this.state.inbox !== undefined && this.state.inbox.length > 0) {
            for (let i = 0; i < this.state.inbox.length; i++) {
                const element = this.state.inbox[i];
                if (element.interactiveActions !== undefined && element.interactiveActions.length > 0) {
                    const action = JSON.parse(element.interactiveActions)[0]
                    Netmera.handleInteractiveAction(action.id);
                    return;
                }
            }
        }
    };

    countForStatus = async () => {
        try {
            const count = await Netmera.countForStatus(this.state.inboxState);
            this.setState({countForStatus: count})
        } catch (error) {
            console.log("error: " + error)
        }
    };

    inboxUpdateStatus = async () => {
        if (this.state.inboxState === Netmera.PUSH_OBJECT_STATUS_ALL) {
            Alert.alert("Error", "Please select different status than all!!")
            console.log("Please select different status than all!!");
            return;
        }
        if (this.state.inbox === undefined || this.state.inbox < 2) {
            Alert.alert("Error", "Push objects count is less then 2!")
            console.log("Push objects count is less then 2!");
            return;
        }
        Netmera.inboxUpdateStatus(0, 2, this.state.inboxState).then(() => {
            console.log("2 push object status was changed successfully.")
        }).catch((error) => {
            console.log("error: " + error)
        });
    };

    updateInboxState = (value) => {
        this.setState({inboxState: value})
    };
 
```

##### Netmera Inbox Category Examples

```
   constructor() {
        super();
        this.state = {
            categories: [],
            categoryState: Netmera.PUSH_OBJECT_STATUS_ALL,
        }
    }

    fetchCategory = async () => {
        try {
            const netmeraCategoryFilter = new NetmeraCategoryFilter();
            netmeraCategoryFilter.status = this.state.categoryState;
            netmeraCategoryFilter.pageSize = 1;
            const categories = await Netmera.fetchCategory(netmeraCategoryFilter);
            console.log("categories", categories);
            this.setState({categories: categories});
        } catch (e) {
            console.log("error", e)
        }
    };

    fetchNextCategoryPage = async () => {
        try {
            const categories = await Netmera.fetchNextCategoryPage();
            this.setState({categories: categories});
            console.log("categories", categories)
        } catch (e) {
            console.log("error", e)
        }
    };

    handlePushObject = async () => {
        if (this.state.categories !== undefined && this.state.categories.length > 0) {
            Netmera.handleLastMessage(this.state.categories[0].categoryName)
        }
    };

    updateStatusCategories = async () => {
        if (this.state.categoryState === Netmera.PUSH_OBJECT_STATUS_ALL) {
            Alert.alert("Error", "Please select different status than all!!")
            console.log("Please select different status than all!!");
            return;
        }
        if (this.state.categories === undefined || this.state.categories < 1) {
            Alert.alert("Error", "Category object not found!")
            console.log("Category object not found!");
            return;
        }

        const count = this.state.categories.length < 3 ? this.state.categories.length : 2;

        Netmera.updateStatusByCategories(0, count, this.state.categoryState).then(() => {
            console.log("Category object status was changed successfully.")
        }).catch((error) => {
            console.log("error: " + error)
        });
    };

    updateCategoryState = (value) => {
        this.setState({categoryState: value})
    };
```

##### Netmera Getting ExternalId (if exists before)

```
    Netmera.currentExternalId()
```


For detailed information please explore example folder in the Netmera sdk library.




  