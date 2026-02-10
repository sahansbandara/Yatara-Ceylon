export const UserRoles = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
} as const;

export const UserStatus = {
    ACTIVE: 'ACTIVE',
    DISABLED: 'DISABLED',
} as const;

export const BookingTypes = {
    PACKAGE: 'PACKAGE',
    VEHICLE: 'VEHICLE',
    CUSTOM: 'CUSTOM',
} as const;

export const BookingStatus = {
    NEW: 'NEW',
    CONTACTED: 'CONTACTED',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export const VehicleTypes = {
    CAR: 'CAR',
    VAN: 'VAN',
    SUV: 'SUV',
    BUS: 'BUS',
    MINIBUS: 'MINIBUS',
    TUK_TUK: 'TUK_TUK',
} as const;

export const VehicleStatus = {
    AVAILABLE: 'AVAILABLE',
    MAINTENANCE: 'MAINTENANCE',
    UNAVAILABLE: 'UNAVAILABLE',
} as const;

export const VehicleBlockReasons = {
    BOOKING: 'BOOKING',
    MAINTENANCE: 'MAINTENANCE',
    PERSONAL: 'PERSONAL',
    OTHER: 'OTHER',
} as const;

export const PartnerTypes = {
    GUIDE: 'GUIDE',
    HOTEL: 'HOTEL',
    DRIVER: 'DRIVER',
    RESTAURANT: 'RESTAURANT',
    OTHER: 'OTHER',
} as const;

export const PartnerStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export const PartnerServiceUnits = {
    PER_DAY: 'PER_DAY',
    PER_TRIP: 'PER_TRIP',
    PER_PERSON: 'PER_PERSON',
    PER_NIGHT: 'PER_NIGHT',
    FLAT: 'FLAT',
} as const;

export const PaymentMethods = {
    CASH: 'CASH',
    BANK: 'BANK',
    CARD_OTHER: 'CARD_OTHER',
} as const;

export const PaymentTypes = {
    PAYMENT: 'PAYMENT',
    REFUND: 'REFUND',
} as const;

export const InvoiceStatus = {
    DRAFT: 'DRAFT',
    FINAL: 'FINAL',
    VOID: 'VOID',
} as const;

export const SupportTicketStatus = {
    OPEN: 'OPEN',
    REPLIED: 'REPLIED',
    CLOSED: 'CLOSED',
} as const;

export const NotificationTypes = {
    OFFER: 'OFFER',
    UPDATE: 'UPDATE',
    ALERT: 'ALERT',
} as const;

export const NotificationVisibility = {
    CUSTOMERS: 'CUSTOMERS',
    STAFF: 'STAFF',
    ALL: 'ALL',
} as const;

export const GalleryPostTypes = {
    IMAGE: 'IMAGE',
    BLOG: 'BLOG',
} as const;

export const DistrictPlaceCategories = {
    TEMPLE: 'TEMPLE',
    BEACH: 'BEACH',
    NATURE: 'NATURE',
    HERITAGE: 'HERITAGE',
    WILDLIFE: 'WILDLIFE',
    ADVENTURE: 'ADVENTURE',
    CITY: 'CITY',
    FOOD: 'FOOD',
    OTHER: 'OTHER',
} as const;

export const CustomPlanStatus = {
    DRAFT: 'DRAFT',
    SAVED: 'SAVED',
} as const;
