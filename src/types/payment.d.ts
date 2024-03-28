declare namespace Payment {
  export interface registerPaymentMethod {
    paymentMethodId: string
    isDefault: boolean
  }

  export interface PaymentInfor {
    sCustomerId: string
    subscription: Subcription
    paymentMethods: PaymentMethod[]
    customer: Customer
  }

  export interface Subcription {
    id: string
    customer: string
    desc: string
    nextBillingDate: string
    totalAmount: any
    items: any
  }

  export interface PaymentMethod {
    id: string
    billing_details: any
    card: Card
    type: string
    isDefault?: boolean
  }

  export interface Card {
    brand: string
    country: string
    exp_month: any
    exp_year: any
    funding: string
    last4: string
  }

  export interface Customer {
    id: string
    email: string
    phone: string
    invoiceSettings: InvoiceSettings
  }

  export interface InvoiceSettings {
    custom_fields: string
    default_payment_method: string
    footer: string
    rendering_options: string
  }

  export interface setDefaultPaymentMethodParams {
    paymentMethodId: string | any
    isDefault: boolean
  }
}
