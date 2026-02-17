import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Leaderboard Types and Data
  public type ScoreEntry = {
    principal : Principal;
    score : Nat;
  };

  module ScoreEntry {
    public func compare(a : ScoreEntry, b : ScoreEntry) : Order.Order {
      Nat.compare(b.score, a.score);
    };
  };

  let scores = Map.empty<Principal, Nat>();

  // Leaderboard Functions
  public shared ({ caller }) func submitScore(score : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };
    
    switch (scores.get(caller)) {
      case (?currentBest) {
        if (score > currentBest) {
          scores.add(caller, score);
        };
      };
      case (null) {
        scores.add(caller, score);
      };
    };
    score;
  };

  public query ({ caller }) func getBestScore() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query scores");
    };
    
    switch (scores.get(caller)) {
      case (?score) { score };
      case (null) {
        Runtime.trap("No score found for this principal");
      };
    };
  };

  public query func getTopScores(count : Nat) : async [ScoreEntry] {
    // Public access - no authorization check needed
    let sortedEntries = scores.entries().toArray().map(func((p, s)) : ScoreEntry { { principal = p; score = s } }).sort();
    sortedEntries.sliceToArray(0, count);
  };
};
