import * as _ from 'lodash';
import * as express from 'express';
import { router, IRoute } from '@helpers/RouteHelpers';
import { ProductTypeStrings, PlanExternalIdTypeStrings, PaymentMethodStrings, PaymentTypeStrings } from '@models/Enums';

/**
 * All routes for the EnumController
 */
const routes : IRoute[] = [
    
    // GET /enums/ProductType
    {
        method: "GET",
        url: "/enums/ProductType",

        handlers: [
            async (req: express.Request, res: express.Response) => {
                res.json(ProductTypeStrings);
            }
        ]
    },

    // GET /enums/PaymentType
    {
        method: "GET",
        url: "/enums/PaymentType",

        handlers: [
            async (req: express.Request, res: express.Response) => {
                res.json(PaymentTypeStrings);
            }
        ]
    },

    // GET /enums/PaymentMethod
    {
        method: "GET",
        url: "/enums/PaymentMethod",

        handlers: [
            async (req: express.Request, res: express.Response) => {
                res.json(PaymentMethodStrings);
            }
        ]
    },

    // GET /enums/PlanExternalIdType
    {
        method: "GET",
        url: "/enums/PlanExternalIdType",

        handlers: [
            async (req: express.Request, res: express.Response) => {
                res.json(PlanExternalIdTypeStrings);
            }
        ]
    }    
];

export function initialize () {
    return router(routes);
}
