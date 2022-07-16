//
//  NotificationService.swift
//  NetmeraReactNativeNotificationServiceExtension
//
//  Created by Inomera Research on 15.07.2022.
//

// Add this class for using Carousel / Slider and Thumbnail Push
import UserNotifications

import NetmeraNotificationServiceExtension

class NotificationService : NetmeraNotificationServiceExtension {

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (_ contentToDeliver: UNNotificationContent) -> Void) {
        super.didReceive(request, withContentHandler: contentHandler)
    }

    override func serviceExtensionTimeWillExpire() {
        super.serviceExtensionTimeWillExpire()
    }
}
