import * as _ from 'lodash';
import {initializeTestService, shutdownTestService, expectEnumToMatch} from '../TestService';

beforeAll(initializeTestService())

afterAll(shutdownTestService);

test('UserStatus_MatchesDatabase', async () => {
    await expectEnumToMatch(['Unconfirmed', 'Active' , 'Disabled'], 'user_status');
});

