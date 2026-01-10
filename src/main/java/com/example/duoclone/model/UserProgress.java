package com.example.duoclone.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UserProgress {
	private int level = 1;
	private int points = 0;
	private final List<String> knownTerms = new ArrayList<>();

	public UserProgress() {}

	public int getLevel() { return level; }
	public void setLevel(int level) { this.level = level; }

	public int getPoints() { return points; }
	public void setPoints(int points) { this.points = points; }

	public List<String> getKnownTerms() { return Collections.unmodifiableList(knownTerms); }

	public void addPoints(int p) {
		if (p <= 0) return;
		points += p;
		if (points >= 100) {
			level += points / 100;
			points = points % 100;
		}
	}

	public void addKnownTerm(String termId) {
		if (termId != null && !termId.isBlank() && !knownTerms.contains(termId)) {
			knownTerms.add(termId);
		}
	}
}
