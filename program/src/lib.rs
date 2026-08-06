use anchor_lang::prelude::*;

declare_id!("Veritas111111111111111111111111111111111111");

#[program]
pub mod veritas {
    use super::*;

    pub fn register_snap(
        ctx: Context<RegisterSnap>,
        image_hash: [u8; 32],
        signature: [u8; 64],
        timestamp: i64,
        lat: f64,
        long: f64,
        uri: String,
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.creator = *ctx.accounts.creator.key;
        attestation.image_hash = image_hash;
        attestation.signature = signature;
        attestation.timestamp = timestamp;
        attestation.lat = lat;
        attestation.long = long;
        attestation.uri = uri;
        attestation.bump = ctx.bumps.attestation;

        msg!("Truth Registered! Hash: {:?}, Lat: {}, Long: {}", image_hash, lat, long);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(image_hash: [u8; 32], uri: String)]
pub struct RegisterSnap<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Attestation::MAX_SIZE + uri.len(),
        seeds = [b"attestation", creator.key().as_ref(), image_hash.as_ref()],
        bump
    )]
    pub attestation: Account<'info, Attestation>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Attestation {
    pub creator: Pubkey,
    pub image_hash: [u8; 32],
    pub signature: [u8; 64],
    pub timestamp: i64,
    pub lat: f64,
    pub long: f64,
    pub uri: String,
    pub bump: u8,
}

impl Attestation {
    pub const MAX_SIZE: usize = 32 + 32 + 64 + 8 + 8 + 8 + 100 + 1; // 100 for URI
}

