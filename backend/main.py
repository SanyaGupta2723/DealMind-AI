from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import asyncio

app = FastAPI(title="Negotiation System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NegotiationRequest(BaseModel):
    seller_asking_price: float
    buyer_max_budget: float
    buyer_min_acceptable: float
    seller_min_acceptable: float
    max_rounds: int = 10


class Round(BaseModel):
    round_number: int
    buyer_offer: float
    seller_asking: float
    gap: float
    buyer_motivation: str
    seller_motivation: str
    mediator_suggestion: str | None = None


class NegotiationResponse(BaseModel):
    success: bool
    final_price: float | None
    agreed: bool
    rounds: List[Round]
    termination_reason: str


def calculate_buyer_offer(
    initial_offer: float,
    seller_asking: float,
    round_num: int,
    max_rounds: int,
    max_budget: float,
) -> float:
    """Buyer gradually increases offer based on round progress."""
    progress = round_num / max_rounds
    # Start at initial offer, gradually move towards seller's asking price
    increasing_offer = initial_offer + (seller_asking - initial_offer) * progress * 0.8
    return min(increasing_offer, max_budget)


def calculate_seller_asking(
    initial_asking: float,
    buyer_offer: float,
    round_num: int,
    max_rounds: int,
    min_acceptable: float,
) -> float:
    """Seller gradually decreases asking price based on round progress."""
    progress = round_num / max_rounds
    # Start at initial asking, gradually move towards buyer's offer
    decreasing_asking = initial_asking - (initial_asking - buyer_offer) * progress * 0.8
    return max(decreasing_asking, min_acceptable)


def get_buyer_motivation(offer: float, previous_offer: float | None = None) -> str:
    """Generate buyer's motivation statement."""
    if previous_offer is None:
        return f"Opening offer at ${offer:.2f} - looking for fair market value."
    
    if offer > previous_offer:
        increase = offer - previous_offer
        return f"Increased offer by ${increase:.2f} to ${offer:.2f} - showing good faith."
    return f"Maintaining offer at ${offer:.2f} - this is competitive."


def get_seller_motivation(asking: float, previous_asking: float | None = None) -> str:
    """Generate seller's motivation statement."""
    if previous_asking is None:
        return f"Listed asking price: ${asking:.2f} - open to negotiation."
    
    if asking < previous_asking:
        decrease = previous_asking - asking
        return f"Reduced asking price by ${decrease:.2f} to ${asking:.2f} - meeting you halfway."
    return f"Maintaining asking price at ${asking:.2f} - fair value for this asset."


def get_mediator_suggestion(
    buyer_offer: float,
    seller_asking: float,
    gap: float,
    round_num: int,
    max_rounds: int,
) -> str | None:
    """Mediator provides suggestions when gap is narrowing."""
    if gap < (seller_asking * 0.1):  # Less than 10% gap
        midpoint = (buyer_offer + seller_asking) / 2
        return f"Gap is closing. Consider meeting at ${midpoint:.2f} - a fair compromise."
    
    if round_num >= max_rounds - 2:  # Last 2 rounds
        midpoint = (buyer_offer + seller_asking) / 2
        return f"Few rounds remaining. Suggest both parties converge on ${midpoint:.2f}."
    
    return None


@app.post("/negotiate", response_model=NegotiationResponse)
async def negotiate(request: NegotiationRequest):
    """Execute multi-agent negotiation."""
    
    # Validation
    if request.seller_asking_price < request.seller_min_acceptable:
        raise HTTPException(status_code=400, detail="Seller asking price below minimum acceptable")
    if request.buyer_max_budget < request.buyer_min_acceptable:
        raise HTTPException(status_code=400, detail="Buyer max budget below minimum acceptable")
    
    rounds: List[Round] = []
    
    # Initial positions
    buyer_offer = request.buyer_max_budget * 0.7  # Start at 70% of budget
    seller_asking = request.seller_asking_price
    previous_buyer_offer = None
    previous_seller_asking = None
    
    for round_num in range(1, request.max_rounds + 1):
        # Calculate new positions
        new_buyer_offer = calculate_buyer_offer(
            buyer_offer,
            seller_asking,
            round_num,
            request.max_rounds,
            request.buyer_max_budget,
        )
        new_seller_asking = calculate_seller_asking(
            seller_asking,
            buyer_offer,
            round_num,
            request.max_rounds,
            request.seller_min_acceptable,
        )
        
        gap = new_seller_asking - new_buyer_offer
        
        # Get motivations
        buyer_motivation = get_buyer_motivation(new_buyer_offer, previous_buyer_offer)
        seller_motivation = get_seller_motivation(new_seller_asking, previous_seller_asking)
        
        # Mediator suggestion
        mediator_suggestion = get_mediator_suggestion(
            new_buyer_offer,
            new_seller_asking,
            gap,
            round_num,
            request.max_rounds,
        )
        
        round_data = Round(
            round_number=round_num,
            buyer_offer=round(new_buyer_offer, 2),
            seller_asking=round(new_seller_asking, 2),
            gap=round(gap, 2),
            buyer_motivation=buyer_motivation,
            seller_motivation=seller_motivation,
            mediator_suggestion=mediator_suggestion,
        )
        
        rounds.append(round_data)
        
        # Check for agreement
        if new_buyer_offer >= new_seller_asking:
            final_price = round((new_buyer_offer + new_seller_asking) / 2, 2)
            return NegotiationResponse(
                success=True,
                final_price=final_price,
                agreed=True,
                rounds=rounds,
                termination_reason=f"Agreement reached at ${final_price:.2f}",
            )
        
        # Check if negotiation is impossible
        if (new_buyer_offer < request.buyer_min_acceptable or
            new_seller_asking > request.seller_asking_price * 1.5):
            return NegotiationResponse(
                success=False,
                final_price=None,
                agreed=False,
                rounds=rounds,
                termination_reason="Negotiation failed - parties too far apart",
            )
        
        # Update for next round
        previous_buyer_offer = new_buyer_offer
        previous_seller_asking = new_seller_asking
        buyer_offer = new_buyer_offer
        seller_asking = new_seller_asking
    
    # Max rounds reached without agreement
    return NegotiationResponse(
        success=False,
        final_price=None,
        agreed=False,
        rounds=rounds,
        termination_reason=f"Negotiation ended after {request.max_rounds} rounds without agreement",
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
