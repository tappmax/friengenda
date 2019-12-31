import * as T from '@helpers/ModelHelpers';

// UserStatus
export const UserStatusStrings = ['Unconfirmed', 'Active', 'Disabled'] as const;
export type UserStatus = typeof UserStatusStrings[number];
export const stringToUserStatus = T.parseStringUnionType<UserStatus>(UserStatusStrings);

// ProductType
export const ProductTypeStrings = ['NAV', 'TLIC', 'TFLIC'] as const;
export type ProductType = typeof ProductTypeStrings[number];
export const stringToProductType = T.parseStringUnionType<ProductType>(ProductTypeStrings);

// PaymentType
export const PaymentTypeStrings = ['Check', 'ACH', 'TRS'] as const;
export type PaymentType = typeof PaymentTypeStrings[number];
export const stringToPaymentType = T.parseStringUnionType<PaymentType>(PaymentTypeStrings);

// PaymentMethod
export const PaymentMethodStrings = ['None', 'Commission', 'RIA'] as const;
export type PaymentMethod = typeof PaymentMethodStrings[number];
export const stringToPaymentMethod = T.parseStringUnionType<PaymentMethod>(PaymentMethodStrings);

// PlanExternalIdType
export const PlanExternalIdTypeStrings = ['None', 'QPP'] as const;
export type PlanExternalIdType = typeof PlanExternalIdTypeStrings[number];
export const stringToPlanExternalIdType = T.parseStringUnionType<PlanExternalIdType>(PlanExternalIdTypeStrings);

// ManagerOrderBy
export const ManagerOrderByStrings = ['id', 'name', 'assets', 'fees'] as const;
export type ManagerOrderBy = typeof ManagerOrderByStrings[number];
export const stringToManagerOrderBy = T.parseStringUnionType<ManagerOrderBy>(ManagerOrderByStrings);

// PlanOrderBy
export const PlanOrderByStrings = ['id', 'name', 'paymentMethod', 'productType','assets','commissions'] as const;
export type PlanOrderBy = typeof PlanOrderByStrings[number];
export const stringToPlanOrderBy = T.parseStringUnionType<PlanOrderBy>(PlanOrderByStrings);

// ContractOrderBy
export const ContractOrderByStrings = ['id', 'name','assets','commissions','fees','manager','bps'] as const;
export type ContractOrderBy = typeof ContractOrderByStrings[number];
export const stringToContractOrderBy = T.parseStringUnionType<ContractOrderBy>(ContractOrderByStrings);

// AdvisorOrderBy
export const AdvisorOrderByStrings = ['id', 'name', 'email', 'commissions', 'paymentType', 'hasAlerts'] as const;
export type AdvisorOrderBy = typeof AdvisorOrderByStrings[number];
export const stringToAdvisorOrderBy = T.parseStringUnionType<AdvisorOrderBy>(AdvisorOrderByStrings);

// BrokerOrderBy
export const BrokerOrderByStrings = ['id', 'name', 'email', 'commissions', 'bps', 'hasAlerts'] as const;
export type BrokerOrderBy = typeof BrokerOrderByStrings[number];
export const stringToBrokerOrderBy = T.parseStringUnionType<BrokerOrderBy>(BrokerOrderByStrings);

// AttachmentType
export const AttachmentTypeStringsReadOnly = ['Statement', 'StatementCommission', 'StatementRIA', 'CheckStatements'] as const; 
export const AttachmentTypeStringsReadWrite = ['W9', 'PaymentInfo'] as const;
export const AttachmentTypeStrings = [...AttachmentTypeStringsReadWrite, ...AttachmentTypeStringsReadOnly] as const;
export type AttachmentType = typeof AttachmentTypeStrings[number];
export const stringToAttachmentType = T.parseStringUnionType<AttachmentType>(AttachmentTypeStrings);
export const stringToAttachmentTypeReadWrite = T.parseStringUnionType<AttachmentType>(AttachmentTypeStringsReadWrite);
