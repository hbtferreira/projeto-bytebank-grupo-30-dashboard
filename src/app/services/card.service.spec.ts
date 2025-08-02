import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardService]
    });
    service = TestBed.inject(CardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial cards', (done) => {
    service.cards$.subscribe(cards => {
      expect(cards.length).toBe(2);
      expect(cards[0].cardNumber).toBe('**** **** **** 1234');
      expect(cards[1].cardNumber).toBe('**** **** **** 5678');
      done();
    });
  });

  it('should toggle card block status', (done) => {
    service.toggleCardBlock('1').subscribe(result => {
      expect(result).toBe(true);

      service.cards$.subscribe(cards => {
        const card = cards.find(c => c.id === '1');
        expect(card?.isBlocked).toBe(true);
        done();
      });
    });
  });

  it('should configure card', (done) => {
    service.configureCard('1').subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });
});
