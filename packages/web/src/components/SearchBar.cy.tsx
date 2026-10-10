import { SearchBar } from './SearchBar';
import { LangStoreProvider } from '../store/langStore';

describe('<SearchBar /> - [ECS-10] Vartotojo objektų paieška pagal pavadinimą', () => {

  const mountComponent = (props = {}) => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    const onGpsRequestSpy = cy.spy().as('onGpsRequestSpy');

    cy.mount(
      <LangStoreProvider>
        <SearchBar
          value=""
          onChange={onChangeSpy}
          onGpsRequest={onGpsRequestSpy}
          gpsLoading={false}
          placeholder="Ieškoti objekto..."
          {...props}
        />
      </LangStoreProvider>
    );

    return { onChangeSpy, onGpsRequestSpy };
  };

  it('UI: Komponentas sėkmingai atvaizduojamas ekrane', () => {
    mountComponent();
    cy.get('input#search-input').should('be.visible');
    cy.get('button#gps-btn').should('be.visible');
  });

  it('TC-ECS10-01 [EP]: Patikrinti paiešką įvedus pilną objekto pavadinimą (AC1, AC2)', () => {
    mountComponent();

    cy.get('input#search-input').type('Trakų pilis');

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', 'Trakų pilis');
  });

  it('TC-ECS10-02 [EP]: Patikrinti paiešką pagal dalinį pavadinimą (AC1, AC2)', () => {
    mountComponent();

    cy.get('input#search-input').type('kated');

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', 'kated');
  });

  it('TC-ECS10-03 [EP]: Patikrinti paieškos lauko elgseną su mišriu raidžių registru (AC3)', () => {
    mountComponent();

    cy.get('input#search-input').type('gEdiMinO PiLiS');

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', 'gEdiMinO PiLiS');
  });

  it('TC-ECS10-04 [DT]: Patikrinti įvestį, kai ieškomas neegzistuojantis objektas (AC4)', () => {
    mountComponent();

    cy.get('input#search-input').type('Xyzqwerty');

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', 'Xyzqwerty');
  });

  it('TC-ECS10-05 [BVA]: Patikrinti elgseną, kai paieškos laukelis paliekamas tuščias (0 simbolių) (AC1)', () => {
    mountComponent();

    cy.get('input#search-input').focus().type('test').clear();

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', '');
  });

  it('TC-ECS10-06 [BVA]: Patikrinti paiešką su minimaliu leistinu kiekiu - 1 simboliu (AC1, AC2)', () => {
    mountComponent();

    cy.get('input#search-input').type('A');

    cy.wait(300);

    cy.get('@onChangeSpy').should('have.been.calledWith', 'A');
  });

  it('ECS-7: Įvesties perdavimas vyksta greitai ir neblokuoja sistemos (<= 2s)', () => {
    const startTime = Date.now();
    mountComponent();

    cy.get('input#search-input').type('Vilnius').then(() => {
      const elapsed = Date.now() - startTime;
      expect(elapsed).to.be.lessThan(2000);
    });
  });
});
