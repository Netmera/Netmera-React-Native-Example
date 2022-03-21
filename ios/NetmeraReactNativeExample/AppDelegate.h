/*
 * Copyright (c) 2022 Inomera Research.
 */

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <Netmera/Netmera.h>
#import <NetmeraCore/NetmeraPushObject.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate, NetmeraPushDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
