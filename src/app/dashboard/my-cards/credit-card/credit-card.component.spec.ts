import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreditCardComponent } from './credit-card.component';
import { Card } from '../../../models/card.model';

describe('CreditCardComponent', () => {
  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;

  const mockCard: Card = {
    id: '1',
    cardNumber: '**** **** **** 1234',
    cardHolder: 'João Silva',
    expiryDate: '12/27',
    brand: 'visa',
    funcao: 'crédito',
    isBlocked: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardComponent);
    component = fixture.componentInstance;
    component.card = mockCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit configure event when onConfigure is called', () => {
    spyOn(component.configure, 'emit');

    component.onConfigure();

    expect(component.configure.emit).toHaveBeenCalledWith(mockCard);
  });

  it('should emit block event when onBlock is called', () => {
    spyOn(component.block, 'emit');

    component.onBlock();

    expect(component.block.emit).toHaveBeenCalledWith(mockCard);
  });

  it('should return correct card brand icon', () => {
    expect(component.getCardBrandIcon('visa')).toBe('credit_card');
    expect(component.getCardBrandIcon('mastercard')).toBe('credit_card');
    expect(component.getCardBrandIcon('elo')).toBe('credit_card');
    expect(component.getCardBrandIcon('unknown')).toBe('credit_card');
  });

  it('should display card information correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.credit-card__number').textContent).toContain('**** **** **** 1234');
    expect(compiled.querySelector('.credit-card__holder').textContent).toContain('João Silva');
    expect(compiled.querySelector('.credit-card__expiry').textContent).toContain('12/27');
    expect(compiled.querySelector('.credit-card__brand').textContent).toContain('VISA');
  });
});
