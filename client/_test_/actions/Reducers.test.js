import * as PortfolioReducer from '../../src/reducers/portfolioReducer';
import * as UserReducer      from '../../src/reducers/userReducer';

describe('reducers', () => {
  it('should have User reducers', () => {
    expect(UserReducer.errorUser()).toHaveProperty('type');
    expect(UserReducer.updateUser()).toHaveProperty('type');
    expect(UserReducer.updatingUser()).toHaveProperty('type');
    expect(UserReducer.warnUser()).toHaveProperty('type');
  });

  it('should have Portfolio reducers', () => {
    expect(PortfolioReducer.addPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.deletePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.errorPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatePortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updateAllPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.updatingPortfolio()).toHaveProperty('type');
    expect(PortfolioReducer.warnPortfolio()).toHaveProperty('type');
  });
});
