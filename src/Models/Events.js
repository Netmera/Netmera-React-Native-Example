/*
 * Copyright (c) 2022 Inomera Research.
 */

class LoginEvent {
    code = "n:cl";

    set userId(userId) {
        this.uid = userId
    }

    set userIda(userId) {
        this.uida = userId
    }

    set userIdax(userId) {
        this.uidas = userId
    }
}

class RegisterEvent {
    code = "n:rg";
}

class ViewCartEvent {
    code = "n:vt";

    set subTotal(value) {
        this.er = value
    }

    set itemCount(value) {
        this.ec = value
    }
}

class PurchaseEvent {
    code = "n:ph";

    set coupon(value) {
        this.ek = value
    }

    set utmSource(value) {
        this.fl = value
    }

    set discount(value) {
        this.el = value
    }

    set paymentMethod(value) {
        this.em = value
    }

    set utmMedium(value) {
        this.fo = value
    }

    set utmCampaign(value) {
        this.fp = value
    }

    set shippingCost(value) {
        this.ep = value
    }

    set subTotal(value) {
        this.er = value
    }

    set itemCount(value) {
        this.ec = value
    }

    set grandTotal(value) {
        this.es = value
    }

    set purchaseLineItemEvent(values) {
        this.items = values
    }
}

class NetmeraLineItem {
    set id(id) {
        this.ea = id
    }

    set name(name) {
        this.eb = name
    }

    set price(price) {
        this.eq = price
    }

    set brandName(brandName) {
        this.eh = brandName
    }

    set brandId(brandId) {
        this.gd = brandId
    }

    set variant(variant) {
        this.ei = variant
    }

    set campaignId(campaignId) {
        this.ge = campaignId
    }

    set count(count) {
        this.ec = count
    }

    set categoryIds(categoryIds) {
        this.ga = categoryIds
    }

    set categoryNames(categoryNames) {
        this.ef = categoryNames
    }

    set keywords(keywords) {
        this.eg = keywords
    }
}

class CustomPurchaseEvent extends PurchaseEvent {
    code = "mxw"

    // Custom Attributes
    set installment(value) {
        this.ea = value
    }
}

// Custom Event
class TestEvent {
    code = "ral"

    set testAttribute(value) {
        this.ea = value
    }
}

export {LoginEvent, RegisterEvent, ViewCartEvent, PurchaseEvent, NetmeraLineItem, CustomPurchaseEvent, TestEvent}