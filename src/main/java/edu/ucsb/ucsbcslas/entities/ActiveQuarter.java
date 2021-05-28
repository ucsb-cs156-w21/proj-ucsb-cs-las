package edu.ucsb.ucsbcslas.entities;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.EqualsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class ActiveQuarter {
    // active quarter id: generated value, data belongs to this entity
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // active quarter: data belongs to this entity
    @JoinColumn(nullable = false)
    private String activeQuarter;

    // get all room slots belonging to this quarter
    @OneToMany(mappedBy = "activeQuarter")
    public List<RoomSlot> roomSlotsByStartTime = new ArrayList<RoomSlot>();

    public ActiveQuarter() { }

    public ActiveQuarter(String activeQuarter) {
        this.activeQuarter = activeQuarter;
    }

    public ActiveQuarter(Long id, String activeQuarter) {
        this.id = id;
        this.activeQuarter = activeQuarter;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActiveQuarter() {
        return this.activeQuarter;
    }

    public void setActiveQuarter(String activeQuarter) {
        this.activeQuarter = activeQuarter;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ActiveQuarter)) {
            return false;
        }
        ActiveQuarter other = (ActiveQuarter) o;
        EqualsBuilder builder = new EqualsBuilder();
        builder.append(id, other.getId()).append(activeQuarter, other.getActiveQuarter());

        return builder.isEquals();
    }

    @Override
    public String toString() {
        return "{" + " id='" + getId() + "'" + ", activeQuarter='" + getActiveQuarter() + "'" + "}";
    }
}
