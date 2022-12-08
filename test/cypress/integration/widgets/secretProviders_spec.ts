describe('Secret Providers widget', () => {
    const widgetId = 'secretProviders';
    const widgetConfiguration = {
        pollingTime: 3,
        pageSize: 0 // NOTE: Setting page size to 0 to list all secret providers and be able to find the one created in test
    };

    before(() => {
        cy.fixture('secret_providers/secret_providers').then(secretProviders => {
            const numberOfSecretProviders = secretProviders.length;

            cy.interceptSp('GET', '/secrets-providers*', {
                items: secretProviders,
                metadata: {
                    pagination: {
                        total: numberOfSecretProviders,
                        size: numberOfSecretProviders,
                        offset: 0
                    }
                }
            });
        });
        cy.activate('valid_trial_license').usePageMock(widgetId, widgetConfiguration).mockLogin();
    });

    it('should allow to list secret providers', () => {
        cy.contains('Secret Provider 1').should('be.visible');
        cy.contains('Secret Provider 2').should('be.visible');
    });
});