package SpkTeam.repository;

import SpkTeam.entity.AccountSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface accountSnapshotRepository extends JpaRepository<AccountSnapshot, Long> {

    List<AccountSnapshot> findByUserEmailAndRecordedAtAfterOrderByRecordedAtAsc(
            String userEmail,
            LocalDateTime after
    );

    boolean existsByUserEmailAndRecordedAtBetween(
            String userEmail,
            LocalDateTime start,
            LocalDateTime end
    );
}
