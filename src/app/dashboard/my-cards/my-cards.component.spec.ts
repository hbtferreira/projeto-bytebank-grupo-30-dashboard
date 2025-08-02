import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyCardsComponent } from './my-cards.component';
import { CardService } from '../../services/card.service';
import { of } from 'rxjs';

describe('MyCardsComponent', () => {
  let component: MyCardsComponent;
  let fixture: ComponentFixture<MyCardsComponent>;
  let cardService: jasmine.SpyObj<CardService>;

  beforeEach(async () => {
    const cardServiceSpy = jasmine.createSpyObj('CardService', ['configureCard', 'toggleCardBlock'], {
      cards$: of([
        {
          id: '1',
          cardNumber: '**** **** **** 1234',
          cardHolder: 'João Silva',
          expiryDate: '12/27',
          brand: 'visa',
          funcao: 'crédito',
          isBlocked: false
        },
        {
          id: '2',
          cardNumber: '**** **** **** 5678',
          cardHolder: 'João Silva',
          expiryDate: '08/26',
          brand: 'mastercard',
          funcao: 'débito',
          isBlocked: false
        }
      ])
    });

    await TestBed.configureTestingModule({
      imports: [MyCardsComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: CardService, useValue: cardServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCardsComponent);
    component = fixture.componentInstance;
    cardService = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cards on init', () => {
    expect(component.cards.length).toBe(2);
  });

  it('should handle card configuration', () => {
    cardService.configureCard.and.returnValue(of(true));
    const mockCard = component.cards[0];

    component.onConfigure(mockCard);

    expect(cardService.configureCard).toHaveBeenCalledWith(mockCard.id);
  });

  it('should handle card block toggle', () => {
    cardService.toggleCardBlock.and.returnValue(of(true));
    const mockCard = component.cards[0];

    component.onBlock(mockCard);

    expect(cardService.toggleCardBlock).toHaveBeenCalledWith(mockCard.id);
  });
});
