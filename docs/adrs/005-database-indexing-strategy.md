# ADR-005: Adopt Compound Indexing for Complaint Dashboards

## Status
Accepted

## Date
2026-06-29

## Context
During a performance profiling session of the database queries, it was discovered that the `EmployeeDashboard` and `AdminDashboard` components heavily rely on filtering the `Complaint` collection by `status` while simultaneously sorting the results by `created_at` (descending). 
Initially, the MongoDB schema only featured single-field indexes for `status` and `created_at`. When a query performs a sort on a field that is not part of the utilized index, MongoDB is forced to perform an in-memory sort, which severely degrades performance at scale (especially when handling >32MB of data, triggering memory limits).

## Decision
We implemented a compound index on the `Complaint` model to precisely match the query pattern of our primary dashboards.

```javascript
complaintSchema.index({ status: 1, created_at: -1 });
```

## Consequences
- **Positive:** Queries matching this filter and sort pattern will now utilize the compound index directly, eliminating the expensive in-memory sort phase (yielding an `IXSCAN` followed by immediate projection instead of a `SORT` stage).
- **Negative:** Minor increase in storage size for the new B-tree index and a negligible write penalty during document insertion. Given the read-heavy nature of the dashboards, this tradeoff is highly favorable.
