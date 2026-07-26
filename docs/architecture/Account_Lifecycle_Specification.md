# Enterprise Identity Account Lifecycle Specification

**System Name:** FinTrack Pro  
**Document Type:** IAM Account State Machine Specification  
**Classification:** Enterprise Internal Security Standard  
**Version:** 3.0.0  

---

## 1. Executive Summary

This specification defines the complete state machine governing user account identities in **FinTrack Pro**. Account state transitions are enforced strictly by `AuthService` and validated prior to executing any state mutation.

---

## 2. Identity State Machine Topology

```mermaid
stateDiagram-v2
    [*] --> Guest
    Guest --> RegistrationRequested: Register Form Submitted
    RegistrationRequested --> PendingVerification: User Identity Created
    PendingVerification --> Active: Email / OTP Verified
    Active --> Locked: 5 Failed Login Attempts
    Locked --> Active: 15 Min Lockout Expires / Admin Reset
    Active --> PasswordUpdated: Password Change / Reset
    PasswordUpdated --> Active: Session Re-authenticated
    Active --> Suspended: Administrative Security Hold
    Suspended --> Active: Admin Reactivation
    Active --> SoftDeleted: Tenant Offboarding / Account Removal
    SoftDeleted --> [*]
```

---

## 3. Account State Matrix & Transition Rules

| State | Authentication Allowed? | API Access Level | Allowed State Transitions |
| :--- | :---: | :--- | :--- |
| **Guest** | No | Unauthenticated Endpoints | `RegistrationRequested` |
| **PendingVerification** | Restricted | Verification Endpoints Only | `Active`, `SoftDeleted` |
| **Active** | Yes | Full Role & Permission Access | `Locked`, `PasswordUpdated`, `Suspended`, `SoftDeleted` |
| **Locked** | Banned (423) | None | `Active` (after 15m expiration) |
| **Suspended** | Banned (403) | None | `Active` (via Super Admin override) |
| **SoftDeleted** | Banned (401) | None | None (Immutable terminal state) |
