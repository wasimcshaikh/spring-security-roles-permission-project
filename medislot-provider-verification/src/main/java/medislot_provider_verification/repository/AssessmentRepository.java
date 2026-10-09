package medislot_provider_verification.repository;

import medislot_provider_verification.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AssessmentRepository
        extends JpaRepository<Assessment, Long> {

    List<Assessment> findByActiveTrueOrderByIdAsc();

    Optional<Assessment> findByIdAndActiveTrue(Long id);

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0
                   THEN true ELSE false END
            FROM Assessment a
            WHERE LOWER(TRIM(a.name)) = LOWER(TRIM(:name))
            """)
    boolean existsByNormalizedName(
            @Param("name") String name
    );
}